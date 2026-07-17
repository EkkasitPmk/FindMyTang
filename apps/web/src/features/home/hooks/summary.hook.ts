import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { TodaySummary } from "../types/summary.type";
import { getThisMonthSummaryApi } from "../services/summary.service";

export const useThisMonthSummary = () => {
  return useQuery<TodaySummary, AxiosError>({
    queryKey: ["summary", "monthly"],
    queryFn: getThisMonthSummaryApi,
  });
};
