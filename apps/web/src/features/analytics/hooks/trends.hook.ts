import { useQuery } from "@tanstack/react-query";
import { getMonthlyTrendsApi } from "../services/trends.service";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";

export const useMonthlyTrends = (year: number) => {
  const isGuest = useGuestStore((state) => state.isGuest);

  return useQuery({
    queryKey: ["analytics", "monthly-trends", year, isGuest],
    queryFn: () => getMonthlyTrendsApi(year),
  });
};
