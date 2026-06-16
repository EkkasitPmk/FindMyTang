import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMeApi, logoutApi } from "../services/auth.service";
import { UserProfile } from "../types/auth.type";

export const useMeQuery = (options?: { enabled?: boolean }) => {
  return useQuery<UserProfile>({
    queryKey: ["auth", "me"],
    queryFn: getMeApi,
    retry: false,
    ...options,
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
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};
