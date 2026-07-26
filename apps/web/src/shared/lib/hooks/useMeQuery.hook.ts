import { useQuery } from "@tanstack/react-query";
import { getMeApi } from "@/features/nav/services/auth.service";
import { UserProfile } from "@/shared/lib/types/user.type";
import { useIsGuest } from "@/shared/lib/storages/guest.storage";

export const useMeQuery = (options?: { enabled?: boolean }) => {
  const isGuest = useIsGuest();
  return useQuery<UserProfile>({
    queryKey: ["auth", "me"],
    queryFn: getMeApi,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    ...options,
    enabled: options?.enabled !== false && !isGuest,
  });
};
