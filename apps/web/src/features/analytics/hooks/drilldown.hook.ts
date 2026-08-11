import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDrilldownApi } from "../services/drilldown.service";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import type { DrilldownResponse } from "../schemas/analytics.response.schema";

export const useDrilldown = (
  categoryId: string,
  month: number,
  year: number,
  options?: { initialData?: DrilldownResponse },
) => {
  const isGuest = useGuestStore((state) => state.isGuest);

  return useQuery({
    queryKey: ["analytics", "drilldown", categoryId, month, year, isGuest],
    queryFn: () => getDrilldownApi(categoryId, month, year),
    placeholderData: keepPreviousData,
    initialData: isGuest ? undefined : options?.initialData,
    staleTime: !isGuest && options?.initialData ? 30_000 : 0,
  });
};
