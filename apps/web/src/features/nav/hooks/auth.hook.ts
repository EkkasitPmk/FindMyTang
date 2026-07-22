import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutApi } from "../services/auth.service";
import { NavLogoutResponse } from "../schemas/nav.response.schema";

export const useLogoutMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation<NavLogoutResponse, Error, void>({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.clear();
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};
