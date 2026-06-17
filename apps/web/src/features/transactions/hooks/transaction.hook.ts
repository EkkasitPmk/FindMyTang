import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createExpenseApi,
  createIncomeApi,
  getTransactionsApi,
} from "../services/transaction.service";
import {
  CreateExpenseRequest,
  CreateIncomeRequest,
  TransactionResponse,
  TransactionQuery,
  PaginatedTransactionResponse,
} from "../types/transaction.type";
import { AxiosError } from "axios";

export interface ApiErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

export const useCreateExpenseMutation = (options?: {
  onSuccess?: (data: TransactionResponse) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation<
    TransactionResponse,
    AxiosError<ApiErrorResponse>,
    CreateExpenseRequest
  >({
    mutationFn: createExpenseApi,
    ...options,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] }).catch(() => {});
      queryClient
        .invalidateQueries({ queryKey: ["transactions"] })
        .catch(() => {});
      options?.onSuccess?.(data);
    },
  });
};

export const useCreateIncomeMutation = (options?: {
  onSuccess?: (data: TransactionResponse) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation<
    TransactionResponse,
    AxiosError<ApiErrorResponse>,
    CreateIncomeRequest
  >({
    mutationFn: createIncomeApi,
    ...options,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] }).catch(() => {});
      queryClient
        .invalidateQueries({ queryKey: ["transactions"] })
        .catch(() => {});
      options?.onSuccess?.(data);
    },
  });
};

export const useTransactionsQuery = (params?: TransactionQuery) => {
  return useQuery<PaginatedTransactionResponse, AxiosError<ApiErrorResponse>>({
    queryKey: ["transactions", params],
    queryFn: () => getTransactionsApi(params),
  });
};
