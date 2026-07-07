import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { CategoryType } from "@prisma/client";

@Injectable()
export class SummaryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getTodayIncome(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await this.prisma.transaction.aggregate({
      where: {
        userId,
        deletedAt: null,
        date: {
          gte: today,
          lt: tomorrow,
        },
        category: {
          type: CategoryType.INCOME,
          deletedAt: null,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return Number(result._sum.amount || 0);
  }

  async getTodayExpense(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await this.prisma.transaction.aggregate({
      where: {
        userId,
        deletedAt: null,
        date: {
          gte: today,
          lt: tomorrow,
        },
        category: {
          type: CategoryType.EXPENSE,
          deletedAt: null,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return Number(result._sum.amount || 0);
  }

  async getThisMonthIncome(userId: string): Promise<number> {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfNextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1,
    );

    const result = await this.prisma.transaction.aggregate({
      where: {
        userId,
        deletedAt: null,
        date: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
        category: {
          type: CategoryType.INCOME,
          deletedAt: null,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return Number(result._sum.amount || 0);
  }

  async getThisMonthExpense(userId: string): Promise<number> {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfNextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1,
    );

    const result = await this.prisma.transaction.aggregate({
      where: {
        userId,
        deletedAt: null,
        date: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
        category: {
          type: CategoryType.EXPENSE,
          deletedAt: null,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return Number(result._sum.amount || 0);
  }

  // ponytail: Calculates the total net worth of the user by summing the balance of all non-deleted assets.
  async getTotalNetWorth(userId: string): Promise<number> {
    const result = await this.prisma.asset.aggregate({
      where: {
        userId,
        deletedAt: null,
      },
      _sum: {
        balance: true,
      },
    });

    return Number(result._sum.balance || 0);
  }
}
