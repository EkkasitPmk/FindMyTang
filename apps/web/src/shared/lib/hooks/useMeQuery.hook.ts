import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getMeApi } from "@/features/nav/services/auth.service";
import { UserProfile } from "@/shared/lib/types/user.type";
import {
  initializeGuestData,
  useGuestStore,
  useIsGuest,
} from "@/shared/lib/storages/guest.storage";

const getMeOrRestoreGuest = async (): Promise<UserProfile> => {
  try {
    return await getMeApi();
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useGuestStore.getState().setGuestMode(true);
      void initializeGuestData().catch(console.error);
    }
    throw error;
  }
};

export const useMeQuery = (options?: { enabled?: boolean }) => {
  const isGuest = useIsGuest();
  return useQuery<UserProfile>({
    queryKey: ["auth", "me"],
    queryFn: getMeOrRestoreGuest,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    ...options,
    enabled: options?.enabled !== false && !isGuest,
  });
};
