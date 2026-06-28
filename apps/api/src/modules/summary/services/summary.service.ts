import { Injectable } from "@nestjs/common";
import { SummaryRepository } from "../repositories/summary.repository";

export interface TodaySummary {
  income: number;
  expense: number;
  net: number;
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
    };
  }

  async getThisMonthSummary(userId: string): Promise<TodaySummary> {
    const income = await this.summaryRepository.getThisMonthIncome(userId);
    const expense = await this.summaryRepository.getThisMonthExpense(userId);

    return {
      income,
      expense,
      net: income - expense,
    };
  }
}
