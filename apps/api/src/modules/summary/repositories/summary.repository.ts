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

  async getTodayExternalTransferAmount(userId: string): Promise<number> {
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
        type: TransactionType.TRANSFER,
        toAssetId: null,
      },
      _sum: {
        amount: true,
      },
    });

    return Number(result._sum.amount || 0);
  }

  async getThisMonthExternalTransferAmount(userId: string): Promise<number> {
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
        type: TransactionType.TRANSFER,
        toAssetId: null,
      },
      _sum: {
        amount: true,
      },
    });

    return Number(result._sum.amount || 0);
  }

  async getTotalNetWorth(userId: string): Promise<number> {
    const assets = await this.prisma.asset.findMany({
      where: {
        userId,
        deletedAt: null,
        isArchived: false,
      },
      select: {
        balance: true,
        includeInSnapshot: true,
        savingsAmount: true,
      },
    });

    let total = 0;
    for (const a of assets) {
      if (!a.includeInSnapshot) continue;
      const bal = Number(a.balance);
      const savings = Math.min(Number(a.savingsAmount || 0), Math.max(0, bal));
      total += bal - savings;
    }
    return total;
  }

  async getExcludedNetWorth(userId: string): Promise<number> {
    const assets = await this.prisma.asset.findMany({
      where: {
        userId,
        deletedAt: null,
        isArchived: false,
      },
      select: {
        balance: true,
        includeInSnapshot: true,
        savingsAmount: true,
      },
    });

    let excluded = 0;
    for (const a of assets) {
      const bal = Number(a.balance);
      if (!a.includeInSnapshot) {
        excluded += bal;
      } else {
        const savings = Math.min(
          Number(a.savingsAmount || 0),
          Math.max(0, bal),
        );
        excluded += savings;
      }
    }
    return excluded;
  }
}
