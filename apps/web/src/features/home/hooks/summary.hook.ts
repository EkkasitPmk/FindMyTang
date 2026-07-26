import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { TodaySummaryResponse } from "../schemas/home.response.schema";
import { getThisMonthSummaryApi } from "../services/summary.service";

export const useThisMonthSummary = () => {
  return useQuery<TodaySummaryResponse, AxiosError>({
    queryKey: ["summary", "monthly"],
    queryFn: getThisMonthSummaryApi,
  });
};
