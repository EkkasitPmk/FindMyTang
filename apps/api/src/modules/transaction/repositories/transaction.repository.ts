import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { Transaction, TransactionType, Prisma } from "@prisma/client";
import { TransactionQueryDto } from "../dto/transaction-query.dto";

export interface CreateTransactionData {
  type: TransactionType;
  amount: number;
  note?: string;
  date: Date;
  assetId: string;
  toAssetId?: string;
  categoryId?: string;
  attachmentUrl?: string | null;
}

type TransactionCursor = { date: string; createdAt: string; id: string };

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    data: CreateTransactionData,
  ): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: { ...data, userId },
    });
  }

  async findById(
    id: string,
    includeDeleted: boolean = false,
  ): Promise<Transaction | null> {
    return this.prisma.transaction.findFirst({
      where: { id, ...(includeDeleted ? {} : { deletedAt: null }) },
    });
  }

  async findAllByUserId(
    userId: string,
    query: TransactionQueryDto = {},
  ): Promise<{
    items: Transaction[];
    total: number;
    nextCursor?: string | null;
    previousCursor?: string | null;
  }> {
    const {
      page = 1,
      limit = 20,
      pagination = "page",
      cursor,
      cursorDirection = "next",
    } = query;
    const useCursor = this.supportsCursor(pagination, query.sortType);
    const where = await this.buildWhere(userId, query);
    this.applyCursorFilter(
      where,
      useCursor ? cursor : undefined,
      query.sortType,
      cursorDirection,
    );

    const items = await this.prisma.transaction.findMany({
      where,
      include: {
        asset: true,
        toAsset: true,
        category: true,
      },
      orderBy: this.getOrderBy(
        query.sortType,
        useCursor && cursorDirection === "previous",
      ),
      skip: useCursor ? undefined : (page - 1) * limit,
      take: useCursor ? limit + 1 : limit,
    });
    let pageItems = items;
    if (useCursor) {
      pageItems = items.slice(0, limit);
      if (cursorDirection === "previous") pageItems.reverse();
    }
    const nextCursor = this.getNextCursor(items, pageItems, limit, useCursor);
    const previousCursor = this.getPreviousCursor(
      items,
      pageItems,
      limit,
      useCursor,
      cursor,
      cursorDirection,
    );
    const total = useCursor
      ? 0
      : await this.prisma.transaction.count({ where });

    return { items: pageItems, total, nextCursor, previousCursor };
  }

  private async buildWhere(
    userId: string,
    query: TransactionQueryDto,
  ): Promise<Prisma.TransactionWhereInput> {
    const { type, assetId, categoryId, from, to, isDeleted, searchKeyword } =
      query;
    const filters: Prisma.TransactionWhereInput[] = [];
    const normalizedSearchKeyword = searchKeyword?.replace(/[฿,\s+-]/g, "");

    if (assetId) {
      filters.push({ OR: [{ assetId }, { toAssetId: assetId }] });
    }

    if (searchKeyword) {
      const amountSearchIds = normalizedSearchKeyword
        ? await this.findAmountSearchIds(userId, normalizedSearchKeyword)
        : [];
      const transactionType = searchKeyword.toUpperCase();
      const typeSearch = Object.values(TransactionType).includes(
        transactionType as TransactionType,
      )
        ? [{ type: transactionType as TransactionType }]
        : [];

      filters.push({
        OR: [
          ...typeSearch,
          { note: { contains: searchKeyword, mode: "insensitive" } },
          {
            category: {
              name: { contains: searchKeyword, mode: "insensitive" },
            },
          },
          { asset: { name: { contains: searchKeyword, mode: "insensitive" } } },
          {
            toAsset: { name: { contains: searchKeyword, mode: "insensitive" } },
          },
          ...(amountSearchIds.length > 0
            ? [{ id: { in: amountSearchIds } }]
            : []),
        ],
      });
    }

    return {
      userId,
      deletedAt: isDeleted ? { not: null } : null,
      ...(type && { type }),
      ...(categoryId && { categoryId }),
      ...(filters.length > 0 && { AND: filters }),
      ...((from || to) && {
        date: {
          ...(from && { gte: new Date(from) }),
          ...(to && { lte: new Date(to) }),
        },
      }),
    };
  }

  private findAmountSearchIds(
    userId: string,
    searchKeyword: string,
  ): Promise<string[]> {
    return this.prisma
      .$queryRaw<Array<{ id: string }>>(
        Prisma.sql`
      SELECT "id"
      FROM "Transaction"
      WHERE "userId" = ${userId}
        AND CAST(ABS("amount") AS TEXT) LIKE ${`%${searchKeyword}%`}
    `,
      )
      .then((rows) => rows.map((row) => row.id));
  }

  private supportsCursor(
    pagination: TransactionQueryDto["pagination"],
    sortType?: string,
  ): boolean {
    return (
      pagination === "cursor" &&
      (!sortType || sortType === "DATE_NEWEST" || sortType === "DATE_OLDEST")
    );
  }

  private getOrderBy(
    sortType?: string,
    reverse: boolean = false,
  ):
    | Prisma.TransactionOrderByWithRelationInput
    | Prisma.TransactionOrderByWithRelationInput[] {
    switch (sortType) {
      case "DATE_OLDEST":
        return reverse
          ? [{ date: "desc" }, { createdAt: "desc" }, { id: "desc" }]
          : [{ date: "asc" }, { createdAt: "asc" }, { id: "asc" }];
      case "AMOUNT_HIGHEST":
        return { amount: "desc" };
      case "AMOUNT_LOWEST":
        return { amount: "asc" };
      case "DATE_NEWEST":
      default:
        return reverse
          ? [{ date: "asc" }, { createdAt: "asc" }, { id: "asc" }]
          : [{ date: "desc" }, { createdAt: "desc" }, { id: "desc" }];
    }
  }

  private applyCursorFilter(
    where: Prisma.TransactionWhereInput,
    cursor: string | undefined,
    sortType?: string,
    cursorDirection: "next" | "previous" = "next",
  ): void {
    if (!cursor) return;

    const decoded = this.decodeCursor(cursor);
    const isOldestFirst = sortType === "DATE_OLDEST";
    let direction: "lt" | "gt" = isOldestFirst ? "gt" : "lt";
    if (cursorDirection === "previous") {
      direction = isOldestFirst ? "lt" : "gt";
    }
    const cursorFilter: Prisma.TransactionWhereInput = {
      OR: [
        { date: { [direction]: new Date(decoded.date) } },
        {
          date: new Date(decoded.date),
          createdAt: { [direction]: new Date(decoded.createdAt) },
        },
        {
          date: new Date(decoded.date),
          createdAt: new Date(decoded.createdAt),
          id: { [direction]: decoded.id },
        },
      ],
    };
    where.AND = [...(Array.isArray(where.AND) ? where.AND : []), cursorFilter];
  }

  private decodeCursor(cursor: string): TransactionCursor {
    try {
      const parsed: unknown = JSON.parse(
        Buffer.from(cursor, "base64url").toString("utf8"),
      );
      if (
        typeof parsed !== "object" ||
        parsed === null ||
        !("date" in parsed) ||
        typeof parsed.date !== "string" ||
        !("createdAt" in parsed) ||
        typeof parsed.createdAt !== "string" ||
        !("id" in parsed) ||
        typeof parsed.id !== "string" ||
        !parsed.date ||
        !parsed.createdAt ||
        !parsed.id
      ) {
        throw new Error("missing cursor fields");
      }
      return parsed as TransactionCursor;
    } catch {
      throw new BadRequestException("Invalid transaction cursor");
    }
  }

  private getNextCursor(
    items: Transaction[],
    pageItems: Transaction[],
    limit: number,
    useCursor: boolean,
  ): string | null {
    const last = pageItems.at(-1);
    if (!useCursor || items.length <= limit || !last) return null;

    return Buffer.from(
      JSON.stringify({
        date: last.date.toISOString(),
        createdAt: last.createdAt.toISOString(),
        id: last.id,
      }),
    ).toString("base64url");
  }

  private getPreviousCursor(
    items: Transaction[],
    pageItems: Transaction[],
    limit: number,
    useCursor: boolean,
    cursor: string | undefined,
    cursorDirection: "next" | "previous",
  ): string | null {
    const first = pageItems[0];
    if (!useCursor || !first) return null;

    if (cursorDirection === "next" && cursor) return this.encodeCursor(first);
    if (cursorDirection === "previous" && items.length > limit) {
      return this.encodeCursor(first);
    }
    return null;
  }

  private encodeCursor(transaction: Transaction): string {
    return Buffer.from(
      JSON.stringify({
        date: transaction.date.toISOString(),
        createdAt: transaction.createdAt.toISOString(),
        id: transaction.id,
      }),
    ).toString("base64url");
  }

  async update(
    id: string,
    userId: string,
    data: Partial<CreateTransactionData> & { deletedAt?: Date | null },
  ): Promise<Transaction> {
    const tx = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });
    if (!tx) throw new Error("Transaction not found or access denied");
    return this.prisma.transaction.update({ where: { id }, data });
  }

  async delete(
    id: string,
    userId: string,
    isHardDelete?: boolean,
  ): Promise<Transaction> {
    const tx = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });
    if (!tx) throw new Error("Transaction not found or access denied");

    if (isHardDelete) {
      return this.prisma.transaction.delete({ where: { id } });
    }

    return this.prisma.transaction.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getAvailableYears(userId: string): Promise<number[]> {
    const records = await this.prisma.transaction.findMany({
      where: { userId, deletedAt: null },
      select: { date: true },
      orderBy: { date: "desc" },
    });
    const years = new Set<number>();
    records.forEach((r) => years.add(r.date.getFullYear()));
    return Array.from(years);
  }

  async getAvailableDates(
    userId: string,
    assetId?: string,
    isDeleted?: boolean,
  ) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        deletedAt: isDeleted ? { not: null } : null,
        ...(assetId
          ? {
              OR: [{ assetId }, { toAssetId: assetId }],
            }
          : {}),
      },
      select: { date: true },
    });

    const datesMap: Record<string, Set<string>> = {};
    const MONTHS = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    transactions.forEach((tx) => {
      const year = tx.date.getFullYear().toString();
      const month = MONTHS[tx.date.getMonth()];
      if (!datesMap[year]) datesMap[year] = new Set();
      datesMap[year].add(month);
    });

    const result: Record<string, string[]> = {};
    for (const year in datesMap) {
      result[year] = Array.from(datesMap[year]);
    }
    return result;
  }
}
