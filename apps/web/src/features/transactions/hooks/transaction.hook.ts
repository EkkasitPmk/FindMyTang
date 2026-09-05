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

type CursorPageParam = {
  cursor?: string;
  cursorDirection: "next" | "previous";
};

type InfiniteTransactionPageParam = number | CursorPageParam;

const invalidateQueries = async (queryClient: QueryClient) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["assets"] }),
    queryClient.invalidateQueries({
      queryKey: ["transactions"],
      refetchType: "all",
    }),
    queryClient.invalidateQueries({
      queryKey: ["transaction"],
      refetchType: "all",
    }),
    queryClient.invalidateQueries({ queryKey: ["summary"] }),
    queryClient.invalidateQueries({ queryKey: ["analytics"] }),
  ]);
};

const getTransactionCachePatch = (transaction: TransactionResponse) => ({
  id: transaction.id,
  type: transaction.type,
  amount: transaction.amount,
  note: transaction.note,
  transactionDate: transaction.transactionDate,
  assetId: transaction.assetId,
  toAssetId: transaction.toAssetId,
  categoryId: transaction.categoryId,
  attachmentUrl: transaction.attachmentUrl,
  updatedAt: transaction.updatedAt,
  deletedAt: transaction.deletedAt,
});

const updateTransactionListCache = (
  cached: unknown,
  transaction: TransactionResponse,
): unknown => {
  if (!cached || typeof cached !== "object") return cached;

  const value = cached as {
    items?: Array<{ id: string }>;
    pages?: unknown[];
  };
  const patch = getTransactionCachePatch(transaction);

  if (Array.isArray(value.items)) {
    return {
      ...value,
      items: value.items.map((item) =>
        item.id === transaction.id ? { ...item, ...patch } : item,
      ),
    };
  }

  if (Array.isArray(value.pages)) {
    return {
      ...value,
      pages: value.pages.map((page) =>
        updateTransactionListCache(page, transaction),
      ),
    };
  }

  return cached;
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
    onSuccess: async (data, variables) => {
      await invalidateQueries(queryClient);
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
    onSuccess: async (data, variables) => {
      const patch = getTransactionCachePatch(data);
      queryClient.setQueriesData(
        { queryKey: ["transaction", variables.id] },
        (cached: unknown) =>
          cached && typeof cached === "object"
            ? { ...(cached as object), ...patch }
            : data,
      );
      queryClient.setQueriesData(
        { queryKey: ["transactions"] },
        (cached: unknown) => updateTransactionListCache(cached, data),
      );
      await invalidateQueries(queryClient);
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
    staleTime: 30_000,
    ...options,
  });
};

export const useInfiniteTransactionsQuery = (
  params?: TransactionQuery,
  options?: {
    enabled?: boolean;
    initialData?: PaginatedTransactionResponse;
    maxPages?: number;
    gcTime?: number;
  },
) => {
  const isGuest = useGuestStore((state) => state.isGuest);

  const queryParams = isGuest ? { limit: 20, ...params } : params;

  return useInfiniteQuery<
    PaginatedTransactionResponse,
    AxiosError<ApiErrorResponse>,
    InfiniteData<PaginatedTransactionResponse>,
    readonly unknown[],
    InfiniteTransactionPageParam
  >({
    queryKey: ["transactions", "infinite", { isGuest, ...params }],
    enabled: options?.enabled ?? true,
    queryFn: async ({ pageParam, signal }) => {
      if (queryParams?.pagination === "cursor") {
        const cursorPageParam = pageParam as CursorPageParam;
        return getTransactionsApi(
          {
            ...queryParams,
            cursor: cursorPageParam.cursor,
            cursorDirection: cursorPageParam.cursorDirection,
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
        return lastPage.meta.nextCursor
          ? { cursor: lastPage.meta.nextCursor, cursorDirection: "next" }
          : undefined;
      }

      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (firstPage: PaginatedTransactionResponse) => {
      if (queryParams?.pagination === "cursor") {
        return firstPage.meta.previousCursor
          ? {
              cursor: firstPage.meta.previousCursor,
              cursorDirection: "previous",
            }
          : undefined;
      }

      return firstPage.meta.page > 1 ? firstPage.meta.page - 1 : undefined;
    },
    maxPages: options?.maxPages,
    initialPageParam:
      queryParams?.pagination === "cursor" ? { cursorDirection: "next" } : 1,
    initialData:
      isGuest || !options?.initialData
        ? undefined
        : {
            pages: [options.initialData],
            pageParams: [
              queryParams?.pagination === "cursor"
                ? { cursorDirection: "next" }
                : 1,
            ],
          },
    staleTime: !isGuest && options?.initialData ? 30_000 : 0,
    gcTime: options?.gcTime ?? (options?.maxPages ? 0 : undefined),
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
    onSuccess: async () => {
      await invalidateQueries(queryClient);
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
  options?: { initialData?: Record<string, string[]> },
) => {
  const isGuest = useGuestStore((state) => state.isGuest);
  return useQuery<Record<string, string[]>, AxiosError<ApiErrorResponse>>({
    queryKey: ["transactions", "availableDates", assetId, isDeleted, isGuest],
    queryFn: () => getAvailableDatesApi(assetId, isDeleted),
    enabled: Boolean(assetId),
    initialData: isGuest ? undefined : options?.initialData,
    staleTime: !isGuest && options?.initialData ? 30_000 : 0,
  });
};

export const useTransactionQuery = (
  id?: string,
  options?: { initialData?: TransactionResponse },
) => {
  const isGuest = useGuestStore((state) => state.isGuest);
  return useQuery<TransactionResponse, AxiosError<ApiErrorResponse>>({
    queryKey: ["transaction", id, isGuest],
    queryFn: () => getTransactionApi(id!),
    enabled: !!id,
    initialData: isGuest ? undefined : options?.initialData,
    staleTime: !isGuest && options?.initialData ? 30_000 : 0,
  });
};
