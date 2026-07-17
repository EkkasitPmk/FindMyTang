import http from "@/shared/lib/api/http";
import { TodaySummary } from "../types/summary.type";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import { db } from "@/shared/lib/storages/dexie.storage";

export const getTodaySummaryApi = async (): Promise<TodaySummary> => {
  if (useGuestStore.getState().isGuest) {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const transactions = await db.transactions
      .filter((t) => !t.deletedAt && t.date.startsWith(todayStr))
      .toArray();

    let income = 0;
    let expense = 0;
    transactions.forEach((t) => {
      if (t.type === "INCOME") income += t.amount;
      if (t.type === "EXPENSE") expense += t.amount;
    });

    const assets = await db.assets.filter((a) => !a.deletedAt).toArray();
    const totalNetWorth = assets.reduce(
      (sum, asset) => sum + Number(asset.balance),
      0,
    );

    return { income, expense, net: income - expense, totalNetWorth };
  }
  const response = await http.get<TodaySummary>("/summary/today");
  return response.data;
};

export const getThisMonthSummaryApi = async (): Promise<TodaySummary> => {
  if (useGuestStore.getState().isGuest) {
    const today = new Date();
    const currentMonthStr = `${today.getFullYear()}-${String(
      today.getMonth() + 1,
    ).padStart(2, "0")}`;
    const transactions = await db.transactions
      .filter((t) => !t.deletedAt && t.date.startsWith(currentMonthStr))
      .toArray();

    let income = 0;
    let expense = 0;
    transactions.forEach((t) => {
      if (t.type === "INCOME") income += t.amount;
      if (t.type === "EXPENSE") expense += t.amount;
    });

    const assets = await db.assets.filter((a) => !a.deletedAt).toArray();
    const totalNetWorth = assets.reduce(
      (sum, asset) => sum + Number(asset.balance),
      0,
    );

    return { income, expense, net: income - expense, totalNetWorth };
  }
  const response = await http.get<TodaySummary>("/summary/monthly");
  return response.data;
};
