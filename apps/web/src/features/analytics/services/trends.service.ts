import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import { db } from "@/shared/lib/storages/dexie.storage";
import http from "@/shared/lib/api/http";
import { MonthlyTrendsResponse } from "../types/analytics.type";

export const getMonthlyTrendsApi = async (
  year: number,
): Promise<MonthlyTrendsResponse> => {
  if (useGuestStore.getState().isGuest) {
    const transactions = await db.transactions
      .filter((t) => !t.deletedAt && t.date.startsWith(year.toString()))
      .toArray();

    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      income: 0,
      expense: 0,
      transfer: 0,
      adjust: 0,
      net: 0,
    }));

    transactions.forEach((t) => {
      const m = Number.parseInt(t.date.split("-")[1], 10);
      const targetMonth = months[m - 1];
      if (t.type === "INCOME") {
        targetMonth.income += t.amount;
        targetMonth.net += t.amount;
      }
      if (t.type === "EXPENSE") {
        targetMonth.expense += t.amount;
        targetMonth.net -= t.amount;
      }
      if (t.type === "TRANSFER") {
        targetMonth.transfer += t.amount;
      }
      if (t.type === "ADJUSTMENT") {
        targetMonth.adjust += t.amount;
      }
    });

    return { year, months };
  }

  const response = await http.get<MonthlyTrendsResponse>("/analytics/trends", {
    params: { year },
  });
  return response.data;
};
