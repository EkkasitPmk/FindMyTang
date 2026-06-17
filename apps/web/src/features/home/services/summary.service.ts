import http from "@/shared/lib/api/http";
import { TodaySummary } from "../types/summary.type";

export const getTodaySummaryApi = async (): Promise<TodaySummary> => {
  const response = await http.get<TodaySummary>("/summary/today");
  return response.data;
};
