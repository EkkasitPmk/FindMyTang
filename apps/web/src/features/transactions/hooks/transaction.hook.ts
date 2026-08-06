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
  queryClient.invalidateQueries({ queryKey: ["transaction"] }).catch(() => {});
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

export const useTransactionsQuery = (
  params?: TransactionQuery,
  options?: {
    enabled?: boolean;
    initialData?: PaginatedTransactionResponse;
    placeholderData?: (
      previousData: PaginatedTransactionResponse | undefined,
    ) => PaginatedTransactionResponse | undefined;
  },
) => {
  const isGuest = useGuestStore((state) => state.isGuest);
  return useQuery<PaginatedTransactionResponse, AxiosError<ApiErrorResponse>>({
    queryKey: ["transactions", { isGuest, ...params }],
    queryFn: () => getTransactionsApi(params),
    initialData: options?.initialData,
    staleTime: options?.initialData ? 30_000 : 0,
    ...options,
  });
};

export const useInfiniteTransactionsQuery = (
  params?: TransactionQuery,
  options?: { enabled?: boolean },
) => {
  const isGuest = useGuestStore((state) => state.isGuest);

  const queryParams = isGuest ? { limit: 20, ...params } : params;

  return useInfiniteQuery<
    PaginatedTransactionResponse,
    AxiosError<ApiErrorResponse>,
    InfiniteData<PaginatedTransactionResponse>,
    readonly unknown[],
    number | string | undefined
  >({
    queryKey: ["transactions", "infinite", { isGuest, ...params }],
    enabled: options?.enabled ?? true,
    queryFn: async ({ pageParam = 1, signal }) => {
      if (queryParams?.pagination === "cursor") {
        return getTransactionsApi(
          {
            ...queryParams,
            cursor: pageParam === 1 ? undefined : (pageParam as string),
          },
          signal,
        );
      }

      return getTransactionsApi(
        { ...queryParams, page: pageParam as number },
        signal,
      );
    },
    getNextPageParam: (lastPage: PaginatedTransactionResponse) => {
      if (queryParams?.pagination === "cursor") {
        return lastPage.meta.nextCursor ?? undefined;
      }

      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    initialPageParam: queryParams?.pagination === "cursor" ? undefined : 1,
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

export const useTransactionYearsQuery = (options?: { enabled?: boolean }) => {
  const isGuest = useGuestStore((state) => state.isGuest);
  return useQuery<number[], AxiosError<ApiErrorResponse>>({
    queryKey: ["transactions", "years", isGuest],
    queryFn: getTransactionYearsApi,
    ...options,
  });
};

export const useAvailableDatesQuery = (
  assetId?: string,
  isDeleted?: boolean,
) => {
  const isGuest = useGuestStore((state) => state.isGuest);
  return useQuery<Record<string, string[]>, AxiosError<ApiErrorResponse>>({
    queryKey: ["transactions", "availableDates", assetId, isDeleted, isGuest],
    queryFn: () => getAvailableDatesApi(assetId, isDeleted),
  });
};

export const useTransactionQuery = (id?: string) => {
  const isGuest = useGuestStore((state) => state.isGuest);
  return useQuery<TransactionResponse, AxiosError<ApiErrorResponse>>({
    queryKey: ["transaction", id, isGuest],
    queryFn: () => getTransactionApi(id!),
    enabled: !!id,
  });
};
