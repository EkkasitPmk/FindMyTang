import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutApi } from "../services/auth.service";

export const useLogoutMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean }, Error, void>({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.clear();
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};
