import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import { db } from "@/shared/lib/storages/dexie.storage";
import http from "@/shared/lib/api/http";
import {
  DrilldownResponse,
  drilldownResponseSchema,
} from "../schemas/analytics.response.schema";

export const getDrilldownApi = async (
  categoryId: string,
  month: number,
  year: number,
): Promise<DrilldownResponse> => {
  if (useGuestStore.getState().isGuest) {
    const startOfCurrentMonth = `${year}-${String(month).padStart(2, "0")}-01`;
    const endOfCurrentMonth = new Date(year, month, 0);
    const endOfCurrentMonthStr = `${year}-${String(month).padStart(2, "0")}-${String(endOfCurrentMonth.getDate()).padStart(2, "0")}T23:59:59`;

    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const startOfPrevMonth = `${prevYear}-${String(prevMonth).padStart(2, "0")}-01`;
    const endOfPrevMonth = new Date(prevYear, prevMonth, 0);
    const endOfPrevMonthStr = `${prevYear}-${String(prevMonth).padStart(2, "0")}-${String(endOfPrevMonth.getDate()).padStart(2, "0")}T23:59:59`;

    const category = await db.categories.get(categoryId);
    const allCurrentMonthTxs = await db.transactions
      .filter(
        (t) =>
          !t.deletedAt &&
          t.date >= startOfCurrentMonth &&
          t.date <= endOfCurrentMonthStr,
      )
      .toArray();

    const prevMonthTxs = await db.transactions
      .filter(
        (t) =>
          !t.deletedAt &&
          t.date >= startOfPrevMonth &&
          t.date <= endOfPrevMonthStr &&
          t.categoryId === categoryId,
      )
      .toArray();

    const assets = await db.assets.toArray();
    const assetMap = new Map(assets.map((a) => [a.id, a]));

    const currentTxs = allCurrentMonthTxs.filter(
      (t) => t.categoryId === categoryId,
    );

    let currentTotal = 0;
    currentTxs.forEach((t) => (currentTotal += t.amount));

    let prevTotal = 0;
    prevMonthTxs.forEach((t) => (prevTotal += t.amount));

    const type = category?.type || "EXPENSE";
    let totalAllType = 0;
    allCurrentMonthTxs.forEach((t) => {
      if (t.type === type) totalAllType += t.amount;
    });

    const formattedTxs = currentTxs
      .map((t) => {
        const asset = assetMap.get(t.assetId);
        return {
          id: t.id,
          type: t.type,
          amount: t.amount,
          note: t.note || null,
          date: t.date,
          asset: {
            id: t.assetId,
            name: asset?.name || "Unknown",
            type: asset?.type || "OTHER",
          },
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return drilldownResponseSchema.parse({
      category: {
        id: category?.id || categoryId,
        name: category?.name || "Unknown",
        color: category?.color || null,
        icon: category?.icon || null,
      },
      summary: {
        currentMonth: currentTotal,
        previousMonth: prevTotal,
        percentageChange:
          prevTotal > 0 ? ((currentTotal - prevTotal) / prevTotal) * 100 : 0,
        percentageOfTotal:
          totalAllType > 0 ? (currentTotal / totalAllType) * 100 : 0,
      },
      transactions: formattedTxs,
    });
  }

  const response = await http.get<DrilldownResponse>(
    `/analytics/categories/${categoryId}/transactions`,
    {
      params: { month, year },
    },
  );
  return drilldownResponseSchema.parse(response.data);
};
