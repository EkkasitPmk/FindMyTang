import { Injectable, NotFoundException } from "@nestjs/common";
import { AnalyticsRepository } from "../repositories/analytics.repository";

// ponytail: minimal in-memory aggregation for analytics, avoiding complex group by queries that break easily
@Injectable()
export class AnalyticsService {
  constructor(private readonly analyticsRepo: AnalyticsRepository) {}

  async getCategoryBreakdown(
    userId: string,
    month: number,
    year: number,
    type: "INCOME" | "EXPENSE" | "TRANSFER" | "ADJUSTMENT",
  ) {
    const transactions = await this.analyticsRepo.getTransactionsForMonth(
      userId,
      month,
      year,
      type,
    );

    let total = 0;
    const categoryMap = new Map<
      string,
      {
        categoryId: string;
        categoryName: string;
        categoryColor: string | null;
        categoryIcon: string | null;
        totalAmount: number;
        transactionCount: number;
      }
    >();

    for (const t of transactions) {
      if (!t.categoryId || !t.category) continue;
      const amount = Number(t.amount);
      total += amount;

      if (!categoryMap.has(t.categoryId)) {
        categoryMap.set(t.categoryId, {
          categoryId: t.category.id,
          categoryName: t.category.name,
          categoryColor: t.category.color,
          categoryIcon: t.category.icon,
          totalAmount: 0,
          transactionCount: 0,
        });
      }
      const cat = categoryMap.get(t.categoryId)!;
      cat.totalAmount += amount;
      cat.transactionCount += 1;
    }

    const breakdown = Array.from(categoryMap.values())
      .map((cat) => ({
        ...cat,
        percentage: total > 0 ? (cat.totalAmount / total) * 100 : 0,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);

    const allTxs = await this.analyticsRepo.getTransactionsForMonth(
      userId,
      month,
      year,
    );
    const income = allTxs
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = allTxs
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const transfer = allTxs
      .filter((t) => t.type === "TRANSFER")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const adjust = allTxs
      .filter((t) => t.type === "ADJUSTMENT")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      summary: {
        income,
        expense,
        transfer,
        adjust,
        net: income - expense,
      },
      breakdown,
    };
  }

  async getMonthlyTrends(userId: string, year: number) {
    const transactions = await this.analyticsRepo.getTransactionsForYear(
      userId,
      year,
    );

    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      income: 0,
      expense: 0,
      net: 0,
    }));

    for (const t of transactions) {
      const monthIndex = t.date.getMonth();
      const amount = Number(t.amount);
      if (t.type === "INCOME") {
        months[monthIndex].income += amount;
      } else if (t.type === "EXPENSE") {
        months[monthIndex].expense += amount;
      }
      months[monthIndex].net =
        months[monthIndex].income - months[monthIndex].expense;
    }

    return {
      year,
      months,
    };
  }

  async getAssetDistribution(userId: string) {
    const assets = await this.analyticsRepo.getActiveAssets(userId);

    let totalAssets = 0;
    const typeMap = new Map<
      string,
      {
        assetType: string;
        totalBalance: number;
        assets: Array<{ id: string; name: string; balance: number }>;
      }
    >();

    for (const a of assets) {
      const balance = Number(a.balance);
      if (balance <= 0) continue;

      totalAssets += balance;

      if (!typeMap.has(a.type)) {
        typeMap.set(a.type, {
          assetType: a.type,
          totalBalance: 0,
          assets: [],
        });
      }

      const group = typeMap.get(a.type)!;
      group.totalBalance += balance;
      group.assets.push({
        id: a.id,
        name: a.name,
        balance,
      });
    }

    const distribution = Array.from(typeMap.values())
      .map((group) => ({
        ...group,
        percentage:
          totalAssets > 0 ? (group.totalBalance / totalAssets) * 100 : 0,
      }))
      .sort((a, b) => b.totalBalance - a.totalBalance);

    return {
      totalAssets,
      distribution,
    };
  }

  async getCategoryTransactions(
    userId: string,
    categoryId: string,
    month: number,
    year: number,
  ) {
    const currentMonthTxs =
      await this.analyticsRepo.getTransactionsByCategoryAndMonth(
        userId,
        categoryId,
        month,
        year,
      );
    const categoryInfo = await this.analyticsRepo.getCategory(
      userId,
      categoryId,
    );

    if (!categoryInfo) throw new NotFoundException("Category not found");

    let prevMonth = month - 1;
    let prevYear = year;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear--;
    }

    const prevMonthTxs =
      await this.analyticsRepo.getTransactionsByCategoryAndMonth(
        userId,
        categoryId,
        prevMonth,
        prevYear,
      );

    const currentMonthTotal = currentMonthTxs.reduce(
      (sum, t) => sum + Number(t.amount),
      0,
    );
    const prevMonthTotal = prevMonthTxs.reduce(
      (sum, t) => sum + Number(t.amount),
      0,
    );

    let percentageChange = 0;
    if (prevMonthTotal > 0) {
      percentageChange =
        ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100;
    } else if (currentMonthTotal > 0) {
      percentageChange = 100;
    }

    const allCurrentMonthTxs = await this.analyticsRepo.getTransactionsForMonth(
      userId,
      month,
      year,
      categoryInfo.type,
    );
    const totalAllCurrentMonth = allCurrentMonthTxs.reduce(
      (sum, t) => sum + Number(t.amount),
      0,
    );

    const percentageOfTotal =
      totalAllCurrentMonth > 0
        ? (currentMonthTotal / totalAllCurrentMonth) * 100
        : 0;

    return {
      category: {
        id: categoryInfo.id,
        name: categoryInfo.name,
        color: categoryInfo.color,
        icon: categoryInfo.icon,
      },
      summary: {
        currentMonth: currentMonthTotal,
        previousMonth: prevMonthTotal,
        percentageChange,
        percentageOfTotal,
      },
      transactions: currentMonthTxs.map((t) => ({
        id: t.id,
        type: t.type,
        amount: Number(t.amount),
        note: t.note,
        date: t.date.toISOString(),
        asset: t.asset,
      })),
    };
  }
}
