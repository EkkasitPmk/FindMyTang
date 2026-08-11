import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCategoryBreakdownApi } from "../services/analytics.service";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import type { CategoryBreakdownResponse } from "../schemas/analytics.response.schema";

export const useCategoryBreakdown = (
  month: number,
  year: number,
  type: "INCOME" | "EXPENSE" | "TRANSFER" | "ADJUSTMENT" = "EXPENSE",
  options?: { initialData?: CategoryBreakdownResponse },
) => {
  const isGuest = useGuestStore((state) => state.isGuest);

  return useQuery({
    queryKey: ["analytics", "category-breakdown", month, year, type, isGuest],
    queryFn: () => getCategoryBreakdownApi(month, year, type),
    placeholderData: keepPreviousData,
    initialData: isGuest ? undefined : options?.initialData,
    staleTime: !isGuest && options?.initialData ? 30_000 : 0,
  });
};
