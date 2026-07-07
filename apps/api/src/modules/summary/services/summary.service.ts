import { Injectable } from "@nestjs/common";
import { SummaryRepository } from "../repositories/summary.repository";

export interface TodaySummary {
  income: number;
  expense: number;
  net: number;
  totalNetWorth: number;
}

@Injectable()
export class SummaryService {
  constructor(private readonly summaryRepository: SummaryRepository) {}

  async getTodaySummary(userId: string): Promise<TodaySummary> {
    const income = await this.summaryRepository.getTodayIncome(userId);
    const expense = await this.summaryRepository.getTodayExpense(userId);

    return {
      income,
      expense,
      net: income - expense,
      totalNetWorth: 0, // ponytail: totalNetWorth is mainly needed in monthly summary for now
    };
  }

  async getThisMonthSummary(userId: string): Promise<TodaySummary> {
    const income = await this.summaryRepository.getThisMonthIncome(userId);
    const expense = await this.summaryRepository.getThisMonthExpense(userId);
    const totalNetWorth = await this.summaryRepository.getTotalNetWorth(userId);

    return {
      income,
      expense,
      net: income - expense,
      totalNetWorth,
    };
  }
}
