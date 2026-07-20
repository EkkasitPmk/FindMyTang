import { useQuery } from "@tanstack/react-query";
import { getCategoryBreakdownApi } from "../services/analytics.service";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";

export const useCategoryBreakdown = (
  month: number,
  year: number,
  type: "INCOME" | "EXPENSE" | "TRANSFER" | "ADJUSTMENT" = "EXPENSE",
) => {
  const isGuest = useGuestStore((state) => state.isGuest);

  return useQuery({
    queryKey: ["analytics", "category-breakdown", month, year, type, isGuest],
    queryFn: () => getCategoryBreakdownApi(month, year, type),
  });
};
