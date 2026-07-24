import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { TransactionType } from "@prisma/client";

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

    // ponytail: when type is TRANSFER, include both TRANSFER and ADJUSTMENT in breakdown
    let typeFilter: TransactionType | { in: TransactionType[] } | undefined;
    if (type === "TRANSFER") {
      typeFilter = {
        in: [TransactionType.TRANSFER, TransactionType.ADJUSTMENT],
      };
    } else if (type) {
      typeFilter = type;
    }

    const where = {
      userId,
      date: {
        gte: startDate,
        lt: endDate,
      },
      deletedAt: null,
      ...(typeFilter && { type: typeFilter }),
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

    // ponytail: handle specialized uncategorized categoryId lookups
    let categoryFilter: Record<string, unknown> = { categoryId };
    if (categoryId === "uncategorized_adjustment") {
      categoryFilter = { categoryId: null, type: "ADJUSTMENT" };
    } else if (categoryId === "uncategorized_transfer") {
      categoryFilter = { categoryId: null, type: "TRANSFER" };
    } else if (categoryId === "uncategorized") {
      categoryFilter = { categoryId: null };
    }

    return this.prisma.transaction.findMany({
      where: {
        userId,
        ...categoryFilter,
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
    if (categoryId === "uncategorized_adjustment") {
      return {
        id: "uncategorized_adjustment",
        name: "Adjustment",
        color: "#6B7280",
        icon: null,
        type: "ADJUSTMENT" as const,
      };
    }
    if (categoryId === "uncategorized_transfer") {
      return {
        id: "uncategorized_transfer",
        name: "Transfer",
        color: "#3B82F6",
        icon: null,
        type: "TRANSFER" as const,
      };
    }
    if (categoryId === "uncategorized") {
      return {
        id: "uncategorized",
        name: "Uncategorized",
        color: "#9CA3AF",
        icon: null,
        type: "EXPENSE" as const,
      };
    }

    return this.prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
        deletedAt: null,
      },
    });
  }
}
