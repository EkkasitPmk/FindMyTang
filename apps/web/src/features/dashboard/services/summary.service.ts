import http from "@/shared/lib/api/http";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import { db } from "@/shared/lib/storages/dexie.storage";
import {
  todaySummaryResponseSchema,
  TodaySummaryResponse,
} from "../schemas/dashboard.response.schema";

export const getTodaySummaryApi = async (): Promise<TodaySummaryResponse> => {
  if (useGuestStore.getState().isGuest) {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const transactions = await db.transactions
      .where("date")
      .between(todayStr, todayStr + "\uffff", true, true)
      .filter((t) => !t.deletedAt)
      .toArray();

    let income = 0;
    let expense = 0;
    let transfer = 0;
    let externalTransfer = 0;
    let adjustment = 0;
    transactions.forEach((t) => {
      if (t.type === "INCOME") income += t.amount;
      if (t.type === "EXPENSE") expense += t.amount;
      if (t.type === "TRANSFER") {
        transfer += t.amount;
        if (!t.toAssetId) {
          externalTransfer += t.amount;
        }
      }
      if (t.type === "ADJUSTMENT") adjustment += t.amount;
    });

    const activeAssets = await db.assets
      .filter((a) => !a.deletedAt && !a.isArchived)
      .toArray();
    let totalNetWorth = 0;
    let excludedNetWorth = 0;
    activeAssets.forEach((asset) => {
      const bal = Number(asset.balance);
      if (asset.includeInSnapshot === false) {
        excludedNetWorth += bal;
      } else {
        const savings = Math.min(
          Number(asset.savingsAmount || 0),
          Math.max(0, bal),
        );
        totalNetWorth += bal - savings;
        excludedNetWorth += savings;
      }
    });

    return todaySummaryResponseSchema.parse({
      income,
      expense,
      transfer,
      adjustment,
      net: income - expense - externalTransfer,
      totalNetWorth,
      excludedNetWorth,
    });
  }
  const response = await http.get<TodaySummaryResponse>("/summary/today");
  return todaySummaryResponseSchema.parse(response.data);
};

export const getThisMonthSummaryApi =
  async (): Promise<TodaySummaryResponse> => {
    if (useGuestStore.getState().isGuest) {
      const today = new Date();
      const currentMonthStr = `${today.getFullYear()}-${String(
        today.getMonth() + 1,
      ).padStart(2, "0")}`;
      const transactions = await db.transactions
        .where("date")
        .between(currentMonthStr, currentMonthStr + "\uffff", true, true)
        .filter((t) => !t.deletedAt)
        .toArray();

      let income = 0;
      let expense = 0;
      let transfer = 0;
      let externalTransfer = 0;
      let adjustment = 0;
      transactions.forEach((t) => {
        if (t.type === "INCOME") income += t.amount;
        if (t.type === "EXPENSE") expense += t.amount;
        if (t.type === "TRANSFER") {
          transfer += t.amount;
          if (!t.toAssetId) {
            externalTransfer += t.amount;
          }
        }
        if (t.type === "ADJUSTMENT") adjustment += t.amount;
      });

      const activeAssets = await db.assets
        .filter((a) => !a.deletedAt && !a.isArchived)
        .toArray();
      let totalNetWorth = 0;
      let excludedNetWorth = 0;
      activeAssets.forEach((asset) => {
        const bal = Number(asset.balance);
        if (asset.includeInSnapshot === false) {
          excludedNetWorth += bal;
        } else {
          const savings = Math.min(
            Number(asset.savingsAmount || 0),
            Math.max(0, bal),
          );
          totalNetWorth += bal - savings;
          excludedNetWorth += savings;
        }
      });

      return todaySummaryResponseSchema.parse({
        income,
        expense,
        transfer,
        adjustment,
        net: income - expense - externalTransfer,
        totalNetWorth,
        excludedNetWorth,
      });
    }
    const response = await http.get<TodaySummaryResponse>("/summary/monthly");
    return todaySummaryResponseSchema.parse(response.data);
  };
