import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getMeApi } from "@/features/nav/services/auth.service";
import { UserProfile } from "@/shared/lib/types/user.type";
import { useIsGuest } from "@/shared/lib/storages/guest.storage";

const AUTH_RECOVERY_POLL_MS = 10_000;

export const useMeQuery = (options?: {
  enabled?: boolean;
  initialUser?: UserProfile | null;
}) => {
  const isGuest = useIsGuest();
  const { enabled, initialUser } = options ?? {};

  return useQuery<UserProfile>({
    queryKey: ["auth", "me"],
    queryFn: getMeApi,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: (query) => {
      if (query.state.status !== "error") return false;
      const error = query.state.error;
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return AUTH_RECOVERY_POLL_MS;
    },
    initialData: initialUser ?? undefined,
    enabled: enabled !== false && !isGuest,
  });
};
