import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";

// ponytail: raw prisma queries with simple where clauses
@Injectable()
export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getTransactionsForMonth(
    userId: string,
    month: number,
    year: number,
    type?: "INCOME" | "EXPENSE" | "TRANSFER" | "ADJUSTMENT",
  ) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const where = {
      userId,
      date: {
        gte: startDate,
        lt: endDate,
      },
      deletedAt: null,
      ...(type && { type }),
    };

    return this.prisma.transaction.findMany({
      where,
      include: {
        category: true,
      },
    });
  }

  async getTransactionsForYear(userId: string, year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    return this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lt: endDate,
        },
        deletedAt: null,
        type: {
          in: ["INCOME", "EXPENSE"],
        },
      },
      select: {
        amount: true,
        type: true,
        date: true,
      },
    });
  }

  async getActiveAssets(userId: string) {
    return this.prisma.asset.findMany({
      where: {
        userId,
        deletedAt: null,
        isArchived: false,
      },
      select: {
        id: true,
        name: true,
        type: true,
        balance: true,
      },
    });
  }

  async getTransactionsByCategoryAndMonth(
    userId: string,
    categoryId: string,
    month: number,
    year: number,
  ) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    return this.prisma.transaction.findMany({
      where: {
        userId,
        categoryId,
        date: {
          gte: startDate,
          lt: endDate,
        },
        deletedAt: null,
      },
      include: {
        asset: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  async getCategory(userId: string, categoryId: string) {
    return this.prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
        deletedAt: null,
      },
    });
  }
}
