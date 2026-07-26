import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutApi, syncUserApi } from "../services/auth.service";
import { NavLogoutResponse } from "../schemas/nav.response.schema";
import { QUERY_CACHE_STORAGE_KEY } from "@/shared/lib/api/queryClient";

export const useLogoutMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation<NavLogoutResponse, Error, void>({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.clear();
      localStorage.removeItem(QUERY_CACHE_STORAGE_KEY);
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useSyncUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: syncUserApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
