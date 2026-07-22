import { useMutation } from "@tanstack/react-query";
import { registerApi } from "../services/register.service";
import { RegisterRequest, RegisterResponse } from "../types/register.type";
import { ApiErrorResponse } from "@/shared/lib/types/api.type";
import { AxiosError } from "axios";

export const useRegisterMutation = (options?: {
  onSuccess?: (data: RegisterResponse) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  return useMutation<
    RegisterResponse,
    AxiosError<ApiErrorResponse>,
    RegisterRequest
  >({
    mutationFn: registerApi,
    ...options,
  });
};
