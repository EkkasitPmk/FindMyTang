import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { Transaction, TransactionType, Prisma } from "@prisma/client";
import { TransactionQueryDto } from "../dto/transaction-query.dto";

export interface CreateTransactionData {
  type: TransactionType;
  amount: number;
  note?: string;
  date: Date;
  assetId: string;
  categoryId?: string;
}

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

  async findById(id: string): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({ where: { id } });
  }

  async findAllByUserId(
    userId: string,
    query: TransactionQueryDto = {},
  ): Promise<{ items: Transaction[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      type,
      assetId,
      categoryId,
      from,
      to,
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.TransactionWhereInput = {
      userId,
      ...(type && { type }),
      ...(assetId && { assetId }),
      ...(categoryId && { categoryId }),
      ...((from || to) && {
        date: {
          ...(from && { gte: new Date(from) }),
          ...(to && { lte: new Date(to) }),
        },
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          asset: true,
          category: true,
        },
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return { items, total };
  }

  async update(
    id: string,
    userId: string,
    data: Partial<CreateTransactionData>,
  ): Promise<Transaction> {
    const tx = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });
    if (!tx) throw new Error("Transaction not found or access denied");
    return this.prisma.transaction.update({ where: { id }, data });
  }

  async delete(id: string, userId: string): Promise<Transaction> {
    const tx = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });
    if (!tx) throw new Error("Transaction not found or access denied");
    return this.prisma.transaction.delete({ where: { id } });
  }
}
