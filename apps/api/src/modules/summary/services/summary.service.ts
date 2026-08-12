import { Injectable, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import { SummaryRepository } from "../repositories/summary.repository";
import { TransactionType } from "@prisma/client";

export interface TodaySummary {
  income: number;
  expense: number;
  transfer: number;
  adjustment: number;
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

    const [income, expense, transfer, adjustment] = await Promise.all([
      this.summaryRepository.getTodayAmount(userId, TransactionType.INCOME),
      this.summaryRepository.getTodayAmount(userId, TransactionType.EXPENSE),
      this.summaryRepository.getTodayAmount(userId, TransactionType.TRANSFER),
      this.summaryRepository.getTodayAmount(userId, TransactionType.ADJUSTMENT),
    ]);
    const result: TodaySummary = {
      income,
      expense,
      transfer,
      adjustment,
      net: income - expense,
      totalNetWorth: 0,
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

    const [income, expense, transfer, adjustment, totalNetWorth] =
      await Promise.all([
        this.summaryRepository.getThisMonthAmount(
          userId,
          TransactionType.INCOME,
        ),
        this.summaryRepository.getThisMonthAmount(
          userId,
          TransactionType.EXPENSE,
        ),
        this.summaryRepository.getThisMonthAmount(
          userId,
          TransactionType.TRANSFER,
        ),
        this.summaryRepository.getThisMonthAmount(
          userId,
          TransactionType.ADJUSTMENT,
        ),
        this.summaryRepository.getTotalNetWorth(userId),
      ]);
    const result: TodaySummary = {
      income,
      expense,
      transfer,
      adjustment,
      net: income - expense,
      totalNetWorth,
    };

    await this.cacheManager.set(cacheKey, result, 60000); // 1 min TTL
    return result;
  }
}
