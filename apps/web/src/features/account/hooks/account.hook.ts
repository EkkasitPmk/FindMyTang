import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProfileApi,
  changePasswordApi,
  deleteAccountApi,
} from "../services/account.service";
import {
  UpdateProfileRequest,
  UpdateProfileResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "../types/account.type";
import { AxiosError } from "axios";

export interface ApiErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

export const useUpdateProfileMutation = (options?: {
  onSuccess?: (data: UpdateProfileResponse) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateProfileResponse,
    AxiosError<ApiErrorResponse>,
    UpdateProfileRequest
  >({
    mutationFn: updateProfileApi,
    ...options,
    onSuccess: (data) => {
      // Synchronize the local auth state cache
      queryClient.setQueryData(["auth", "me"], data);
      void queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      options?.onSuccess?.(data);
    },
  });
};

export const useChangePasswordMutation = (options?: {
  onSuccess?: (data: ChangePasswordResponse) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  return useMutation<
    ChangePasswordResponse,
    AxiosError<ApiErrorResponse>,
    ChangePasswordRequest
  >({
    mutationFn: changePasswordApi,
    ...options,
  });
};

export const useDeleteAccountMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  return useMutation<void, AxiosError<ApiErrorResponse>, void>({
    mutationFn: deleteAccountApi,
    ...options,
  });
};
