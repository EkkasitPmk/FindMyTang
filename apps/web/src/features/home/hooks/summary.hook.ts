import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getTodaySummaryApi } from "../services/summary.service";
import { TodaySummary } from "../types/summary.type";
import { useGuestStore, useIsGuest } from "@/shared/lib/store/guest-store";

export interface ApiErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

export const useTodaySummary = () => {
  const isGuest = useIsGuest();
  const transactions = useGuestStore((state) => state.transactions);

  return useQuery<TodaySummary, AxiosError<ApiErrorResponse>>({
    queryKey: ["summary", "today"],
    queryFn: getTodaySummaryApi,
    enabled: !isGuest,
    initialData: isGuest
      ? (() => {
          const today = new Date().toISOString().split("T")[0];
          const todayTransactions = transactions.filter((t) =>
            t.transactionDate.startsWith(today),
          );
          const income = todayTransactions
            .filter((t) => t.type === "INCOME")
            .reduce((acc, t) => acc + t.amount, 0);
          const expense = todayTransactions
            .filter((t) => t.type === "EXPENSE")
            .reduce((acc, t) => acc + t.amount, 0);
          return {
            income,
            expense,
            net: income - expense,
          };
        })()
      : undefined,
  });
};
