import { useQuery } from "@tanstack/react-query";
import { getAssetsApi } from "@/features/assets/services/assets.service";
import { Asset } from "@/shared/lib/types/asset.type";
import { ApiErrorResponse } from "@/shared/lib/types/api.type";
import { AxiosError } from "axios";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";

export type UseAssetsOptions = {
  includeDeleted?: boolean;
  enabled?: boolean;
};

export const useAssets = (options?: UseAssetsOptions) => {
  const includeDeleted = options?.includeDeleted ?? false;
  const enabled = options?.enabled ?? true;
  const isGuest = useGuestStore((state) => state.isGuest);

  return useQuery<Asset[], AxiosError<ApiErrorResponse>>({
    queryKey: ["assets", { includeDeleted, isGuest }],
    queryFn: () => getAssetsApi(includeDeleted),
    enabled,
  });
};
