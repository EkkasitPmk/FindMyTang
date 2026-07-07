import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useIsGuest, useGuestStore } from "@/shared/lib/storages/guest.storage";
import { TodaySummary } from "../types/summary.type";
import { getThisMonthSummaryApi } from "../services/summary.service";

export const useThisMonthSummary = () => {
  const isGuest = useIsGuest();
  const guestTransactions = useGuestStore((state) => state.transactions);
  const guestAssets = useGuestStore((state) => state.assets);

  return useQuery<TodaySummary, AxiosError>({
    queryKey: ["summary", "monthly"],
    queryFn: getThisMonthSummaryApi,
    enabled: !isGuest,
    initialData: isGuest
      ? (() => {
          const today = new Date();
          const currentMonth = today.getMonth();
          const currentYear = today.getFullYear();
          let income = 0;
          let expense = 0;
          guestTransactions.forEach((t) => {
            const date = new Date(t.transactionDate);
            if (
              date.getMonth() === currentMonth &&
              date.getFullYear() === currentYear
            ) {
              if (t.type === "INCOME") income += t.amount;
              if (t.type === "EXPENSE") expense += t.amount;
            }
          });
          const totalNetWorth = guestAssets.reduce(
            (sum, asset) => sum + Number(asset.balance),
            0,
          );
          return {
            income,
            expense,
            net: income - expense,
            totalNetWorth,
          };
        })()
      : undefined,
  });
};
