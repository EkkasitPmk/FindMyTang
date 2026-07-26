import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { TodaySummaryResponse } from "../schemas/home.response.schema";
import { getThisMonthSummaryApi } from "../services/summary.service";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";

export const useThisMonthSummary = () => {
  const isGuest = useGuestStore((state) => state.isGuest);
  return useQuery<TodaySummaryResponse, AxiosError>({
    queryKey: ["summary", "monthly", { isGuest }],
    queryFn: getThisMonthSummaryApi,
  });
};
