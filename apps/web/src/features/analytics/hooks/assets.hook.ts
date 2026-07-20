import { useQuery } from "@tanstack/react-query";
import { getAssetDistributionApi } from "../services/assets.service";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";

export const useAssetDistribution = () => {
  const isGuest = useGuestStore((state) => state.isGuest);

  return useQuery({
    queryKey: ["analytics", "asset-distribution", isGuest],
    queryFn: () => getAssetDistributionApi(),
  });
};
