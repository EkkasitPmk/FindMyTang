import { useQuery } from "@tanstack/react-query";
import {
  getThisMonthSummaryApi,
  getTodaySummaryApi,
} from "../services/summary.service";
import { TodaySummary } from "../types/summary.type";
import { AxiosError } from "axios";
import { useIsGuest, useGuestStore } from "@/shared/lib/store/guest-store";

export const useTodaySummary = () => {
  const isGuest = useIsGuest();

  return useQuery<TodaySummary, AxiosError>({
    queryKey: ["summary", "today"],
    queryFn: getTodaySummaryApi,
    enabled: !isGuest,
    initialData: isGuest
      ? {
          income: 0,
          expense: 0,
          net: 0,
        }
      : undefined,
  });
};

export const useThisMonthSummary = () => {
  const isGuest = useIsGuest();
  const guestTransactions = useGuestStore((state) => state.transactions);

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
          return {
            income,
            expense,
            net: income - expense,
          };
        })()
      : undefined,
  });
};
