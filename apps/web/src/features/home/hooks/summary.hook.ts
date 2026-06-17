import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getTodaySummaryApi } from "../services/summary.service";
import { TodaySummary } from "../types/summary.type";

export interface ApiErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

export const useTodaySummary = () => {
  return useQuery<TodaySummary, AxiosError<ApiErrorResponse>>({
    queryKey: ["summary", "today"],
    queryFn: getTodaySummaryApi,
  });
};
