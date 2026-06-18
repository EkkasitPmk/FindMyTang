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
}
