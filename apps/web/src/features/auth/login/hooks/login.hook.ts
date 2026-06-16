import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../services/login.service";
import {
  LoginRequest,
  LoginResponse,
  ApiErrorResponse,
} from "../types/login.type";
import { AxiosError } from "axios";

export const useLoginMutation = (options?: {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  return useMutation<LoginResponse, AxiosError<ApiErrorResponse>, LoginRequest>(
    {
      mutationFn: loginApi,
      ...options,
    },
  );
};
