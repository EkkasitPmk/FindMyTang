import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { TransactionType } from "@prisma/client";

@Injectable()
export class SummaryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getTodayAmount(userId: string, type: TransactionType): Promise<number> {
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
        type,
      },
      _sum: {
        amount: true,
      },
    });

    return Number(result._sum.amount || 0);
  }

  async getThisMonthAmount(
    userId: string,
    type: TransactionType,
  ): Promise<number> {
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
        type,
      },
      _sum: {
        amount: true,
      },
    });

    return Number(result._sum.amount || 0);
  }

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
