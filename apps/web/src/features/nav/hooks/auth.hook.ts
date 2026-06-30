import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMeApi, logoutApi } from "../services/auth.service";
import { UserProfile } from "../types/auth.type";
import { useIsGuest } from "@/shared/lib/storages/guest.storage";

export const useMeQuery = (options?: { enabled?: boolean }) => {
  const isGuest = useIsGuest();
  return useQuery<UserProfile>({
    queryKey: ["auth", "me"],
    queryFn: getMeApi,
    retry: false,
    ...options,
    enabled: options?.enabled !== false && !isGuest,
  });
};

export const useLogoutMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean }, Error, void>({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      void queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};
