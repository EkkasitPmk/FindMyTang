import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { TodaySummaryResponse } from "../schemas/dashboard.response.schema";
import { getThisMonthSummaryApi } from "../services/summary.service";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";

export const useThisMonthSummary = (initialData?: TodaySummaryResponse) => {
  const isGuest = useGuestStore((state) => state.isGuest);
  return useQuery<TodaySummaryResponse, AxiosError>({
    queryKey: ["summary", "monthly", { isGuest }],
    queryFn: getThisMonthSummaryApi,
    initialData,
    staleTime: 30_000,
  });
};
