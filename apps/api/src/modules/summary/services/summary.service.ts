import { Injectable, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import { SummaryRepository } from "../repositories/summary.repository";

export interface TodaySummary {
  income: number;
  expense: number;
  net: number;
  totalNetWorth: number;
}

@Injectable()
export class SummaryService {
  constructor(
    private readonly summaryRepository: SummaryRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getTodaySummary(userId: string): Promise<TodaySummary> {
    const cacheKey = `summary_today_${userId}`;
    const cached = await this.cacheManager.get<TodaySummary>(cacheKey);
    if (cached) {
      return cached;
    }

    const income = await this.summaryRepository.getTodayIncome(userId);
    const expense = await this.summaryRepository.getTodayExpense(userId);
    const result: TodaySummary = {
      income,
      expense,
      net: income - expense,
      totalNetWorth: 0, // ponytail: totalNetWorth is mainly needed in monthly summary for now
    };

    await this.cacheManager.set(cacheKey, result, 60000); // 1 min TTL
    return result;
  }

  async getThisMonthSummary(userId: string): Promise<TodaySummary> {
    const cacheKey = `summary_month_${userId}`;
    const cached = await this.cacheManager.get<TodaySummary>(cacheKey);
    if (cached) {
      return cached;
    }

    const income = await this.summaryRepository.getThisMonthIncome(userId);
    const expense = await this.summaryRepository.getThisMonthExpense(userId);
    const totalNetWorth = await this.summaryRepository.getTotalNetWorth(userId);
    const result: TodaySummary = {
      income,
      expense,
      net: income - expense,
      totalNetWorth,
    };

    await this.cacheManager.set(cacheKey, result, 60000); // 1 min TTL
    return result;
  }
}
