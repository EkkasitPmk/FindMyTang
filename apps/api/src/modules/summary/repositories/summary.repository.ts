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
        date: {
          gte: today,
          lt: tomorrow,
        },
        category: {
          type: CategoryType.INCOME,
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
        date: {
          gte: today,
          lt: tomorrow,
        },
        category: {
          type: CategoryType.EXPENSE,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return Number(result._sum.amount || 0);
  }
}
