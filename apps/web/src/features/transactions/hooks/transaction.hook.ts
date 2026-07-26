import {
  useMutation,
  useQuery,
  useQueryClient,
  QueryClient,
  useInfiniteQuery,
  InfiniteData,
} from "@tanstack/react-query";
import {
  createTransactionApi,
  getTransactionsApi,
  getTransactionYearsApi,
  updateTransactionApi,
  deleteTransactionApi,
  getAvailableDatesApi,
  getTransactionApi,
} from "../services/transaction.service";
import {
  TransactionResponse,
  TransactionQuery,
  PaginatedTransactionResponse,
  UpdateTransactionRequest,
  TransactionType,
  CreateTransactionPayload,
} from "@/shared/lib/types/transaction.type";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/shared/lib/types/api.type";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";

const invalidateQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["assets"] }).catch(() => {});
  queryClient.invalidateQueries({ queryKey: ["transactions"] }).catch(() => {});
  queryClient.invalidateQueries({ queryKey: ["summary"] }).catch(() => {});
};

export const useCreateTransactionMutation = (options?: {
  onSuccess?: (
    data: TransactionResponse,
    variables: {
      type: TransactionType;
      data: CreateTransactionPayload;
    },
  ) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<
    TransactionResponse,
    AxiosError<ApiErrorResponse>,
    {
      type: TransactionType;
      data: CreateTransactionPayload;
    }
  >({
    mutationFn: ({ type, data }) => createTransactionApi(data, type),
    ...options,
    onSuccess: (data, variables) => {
      invalidateQueries(queryClient);
      options?.onSuccess?.(data, variables);
    },
  });
};

export const useUpdateTransactionMutation = (options?: {
  onSuccess?: (data: TransactionResponse) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<
    TransactionResponse,
    AxiosError<ApiErrorResponse>,
    { id: string; data: UpdateTransactionRequest }
  >({
    mutationFn: ({ id, data }) => updateTransactionApi(id, data),
    ...options,
    onSuccess: (data) => {
      invalidateQueries(queryClient);
      options?.onSuccess?.(data);
    },
  });
};

export const useTransactionsQuery = (params?: TransactionQuery) => {
  const isGuest = useGuestStore((state) => state.isGuest);
  return useQuery<PaginatedTransactionResponse, AxiosError<ApiErrorResponse>>({
    queryKey: ["transactions", { isGuest, ...params }],
    queryFn: () => getTransactionsApi(params),
  });
};

export const useInfiniteTransactionsQuery = (params?: TransactionQuery) => {
  const isGuest = useGuestStore((state) => state.isGuest);
  return useInfiniteQuery<
    PaginatedTransactionResponse,
    AxiosError<ApiErrorResponse>,
    InfiniteData<PaginatedTransactionResponse>,
    readonly unknown[],
    number
  >({
    queryKey: ["transactions", "infinite", { isGuest, ...params }],
    queryFn: async ({ pageParam = 1 }) => {
      const page = pageParam as number;
      return getTransactionsApi({ ...params, page });
    },
    getNextPageParam: (lastPage: PaginatedTransactionResponse) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};

export const useDeleteTransactionMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiErrorResponse>,
    { id: string; isHardDelete?: boolean }
  >({
    mutationFn: ({ id, isHardDelete }) =>
      deleteTransactionApi(id, isHardDelete),
    ...options,
    onSuccess: () => {
      invalidateQueries(queryClient);
      options?.onSuccess?.();
    },
  });
};

export const useTransactionYearsQuery = () => {
  return useQuery<number[], AxiosError<ApiErrorResponse>>({
    queryKey: ["transactions", "years"],
    queryFn: getTransactionYearsApi,
  });
};

export const useAvailableDatesQuery = (
  assetId?: string,
  isDeleted?: boolean,
) => {
  return useQuery<Record<string, string[]>, AxiosError<ApiErrorResponse>>({
    queryKey: ["transactions", "availableDates", assetId, isDeleted],
    queryFn: () => getAvailableDatesApi(assetId, isDeleted),
  });
};

export const useTransactionQuery = (id?: string) => {
  return useQuery<TransactionResponse, AxiosError<ApiErrorResponse>>({
    queryKey: ["transaction", id],
    queryFn: () => getTransactionApi(id!),
    enabled: !!id,
  });
};
