import { useQuery } from "@tanstack/react-query";
import { getDrilldownApi } from "../services/drilldown.service";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";

export const useDrilldown = (
  categoryId: string,
  month: number,
  year: number,
) => {
  const isGuest = useGuestStore((state) => state.isGuest);

  return useQuery({
    queryKey: ["analytics", "drilldown", categoryId, month, year, isGuest],
    queryFn: () => getDrilldownApi(categoryId, month, year),
  });
};
