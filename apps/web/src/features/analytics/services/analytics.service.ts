import http from "@/shared/lib/api/http";
import {
  CategoryBreakdownResponse,
  categoryBreakdownResponseSchema,
} from "../schemas/analytics.response.schema";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import { db } from "@/shared/lib/storages/dexie.storage";

export const getCategoryBreakdownApi = async (
  month: number,
  year: number,
  type: "INCOME" | "EXPENSE" | "TRANSFER" | "ADJUSTMENT" = "EXPENSE",
): Promise<CategoryBreakdownResponse> => {
  if (useGuestStore.getState().isGuest) {
    const startOfMonthStr = `${year}-${String(month).padStart(2, "0")}-01`;
    const endOfMonth = new Date(year, month, 0);
    const endOfMonthStr = `${year}-${String(month).padStart(2, "0")}-${String(endOfMonth.getDate()).padStart(2, "0")}T23:59:59`;

    const transactions = await db.transactions
      .filter(
        (t) =>
          !t.deletedAt && t.date >= startOfMonthStr && t.date <= endOfMonthStr,
      )
      .toArray();

    const categories = await db.categories
      .filter((c) => !c.deletedAt)
      .toArray();
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    let income = 0;
    let expense = 0;
    let transfer = 0;
    let adjust = 0;
    let totalTypeAmount = 0;
    const categoryTotals = new Map<string, { total: number; count: number }>();

    transactions.forEach((t) => {
      if (t.type === "INCOME") income += t.amount;
      if (t.type === "EXPENSE") expense += t.amount;
      if (t.type === "TRANSFER") transfer += t.amount;
      if (t.type === "ADJUSTMENT") adjust += t.amount;

      const isMatch =
        t.type === type ||
        (type === "TRANSFER" &&
          (t.type === "TRANSFER" || t.type === "ADJUSTMENT"));

      if (isMatch) {
        totalTypeAmount += t.amount;
        let catId = t.categoryId;
        if (!catId) {
          if (t.type === "ADJUSTMENT") catId = "uncategorized_adjustment";
          else if (t.type === "TRANSFER") catId = "uncategorized_transfer";
          else catId = "uncategorized";
        }

        const existing = categoryTotals.get(catId) || {
          total: 0,
          count: 0,
        };
        categoryTotals.set(catId, {
          total: existing.total + t.amount,
          count: existing.count + 1,
        });
      }
    });

    const breakdown = Array.from(categoryTotals.entries())
      .map(([categoryId, data]) => {
        const cat = categoryMap.get(categoryId);
        let name = cat?.name;
        let color = cat?.color || null;
        const icon = cat?.icon || null;

        if (!name) {
          if (categoryId === "uncategorized_adjustment") {
            name = "Adjustment";
            color = "#6B7280";
          } else if (categoryId === "uncategorized_transfer") {
            name = "Transfer";
            color = "#3B82F6";
          } else {
            name = "Uncategorized";
            color = "#9CA3AF";
          }
        }

        return {
          categoryId,
          categoryName: name,
          categoryColor: color,
          categoryIcon: icon,
          totalAmount: data.total,
          percentage:
            totalTypeAmount > 0 ? (data.total / totalTypeAmount) * 100 : 0,
          transactionCount: data.count,
        };
      })
      .sort((a, b) => b.totalAmount - a.totalAmount);

    return categoryBreakdownResponseSchema.parse({
      summary: { income, expense, transfer, adjust, net: income - expense },
      breakdown,
    });
  }

  const response = await http.get<CategoryBreakdownResponse>(
    "/analytics/categories",
    {
      params: { month, year, type },
    },
  );
  return categoryBreakdownResponseSchema.parse(response.data);
};
