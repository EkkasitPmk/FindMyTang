import {
  useMutation,
  useQuery,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import {
  createTransactionApi,
  getTransactionsApi,
  updateTransactionApi,
  deleteTransactionApi,
} from "../services/transaction.service";
import {
  TransactionResponse,
  TransactionQuery,
  PaginatedTransactionResponse,
  UpdateTransactionRequest,
  TransactionType,
  CreateTransactionPayload,
} from "../types/transaction.type";
import { AxiosError } from "axios";
import { useGuestStore, useIsGuest } from "@/shared/lib/storages/guest.storage";

export interface ApiErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

const invalidateQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["assets"] }).catch(() => {});
  queryClient.invalidateQueries({ queryKey: ["transactions"] }).catch(() => {});
};

interface MockTransactionData {
  assetId: string;
  categoryId?: string;
  toAssetId?: string;
  amount: number;
  note?: string;
  transactionDate: string;
  file?: File | null;
}

const createMockTransaction = (
  type: TransactionType,
  data: MockTransactionData,
  state: ReturnType<typeof useGuestStore.getState>,
): TransactionResponse => {
  const asset = state.assets.find((a) => a.id === data.assetId);
  const category = data.categoryId
    ? state.categories.find((c) => c.id === data.categoryId)
    : undefined;
  const toAsset = data.toAssetId
    ? state.assets.find((a) => a.id === data.toAssetId)
    : undefined;

  return {
    id: crypto.randomUUID(),
    type,
    amount: data.amount,
    note: data.note,
    transactionDate: data.transactionDate,
    assetId: data.assetId,
    categoryId: data.categoryId,
    toAssetId: data.toAssetId,
    attachmentUrl: data.file ? URL.createObjectURL(data.file) : undefined,
    asset: asset ? { ...asset } : undefined,
    category: category ? { ...category } : undefined,
    toAsset: toAsset ? { ...toAsset } : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const handleGuestAssetBalanceUpdate = (
  data: TransactionResponse,
  variables: {
    type: TransactionType;
    data: CreateTransactionPayload;
  },
  state: ReturnType<typeof useGuestStore.getState>,
) => {
  if (variables.type === "INCOME" || variables.type === "ADJUSTMENT") {
    const asset = state.assets.find((a) => a.id === data.assetId);
    if (asset) {
      state.updateAsset(asset.id, { balance: asset.balance + data.amount });
    }
  } else if (variables.type === "EXPENSE") {
    const asset = state.assets.find((a) => a.id === data.assetId);
    if (asset) {
      state.updateAsset(asset.id, { balance: asset.balance - data.amount });
    }
  } else if (variables.type === "TRANSFER") {
    const fromAsset = state.assets.find((a) => a.id === data.assetId);
    const toAsset = state.assets.find((a) => a.id === data.toAssetId);
    if (fromAsset) {
      state.updateAsset(fromAsset.id, {
        balance: fromAsset.balance - data.amount,
      });
    }
    if (toAsset) {
      state.updateAsset(toAsset.id, {
        balance: toAsset.balance + data.amount,
      });
    }
  }
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
  const isGuest = useGuestStore((state) => state.isGuest);
  const addTransaction = useGuestStore((state) => state.addTransaction);

  return useMutation<
    TransactionResponse,
    AxiosError<ApiErrorResponse>,
    {
      type: TransactionType;
      data: CreateTransactionPayload;
    }
  >({
    mutationFn: async ({ type, data }) => {
      if (isGuest) {
        const state = useGuestStore.getState();
        if (type === "ADJUSTMENT") {
          const asset = state.assets.find((a) => a.id === data.assetId);
          const difference = data.amount - (asset?.balance || 0);
          return createMockTransaction(
            type,
            { ...data, amount: difference },
            state,
          );
        }
        return createMockTransaction(type, data, state);
      }
      return createTransactionApi(data, type);
    },
    ...options,
    onSuccess: (data, variables) => {
      if (isGuest) {
        addTransaction(data);
        const state = useGuestStore.getState();
        handleGuestAssetBalanceUpdate(data, variables, state);
      } else {
        invalidateQueries(queryClient);
      }
      options?.onSuccess?.(data, variables);
    },
  });
};

export const useUpdateTransactionMutation = (options?: {
  onSuccess?: (data: TransactionResponse) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  const isGuest = useGuestStore((state) => state.isGuest);
  const updateTransaction = useGuestStore((state) => state.updateTransaction);

  return useMutation<
    TransactionResponse,
    AxiosError<ApiErrorResponse>,
    { id: string; data: UpdateTransactionRequest }
  >({
    mutationFn: async ({ id, data }) => {
      if (isGuest) {
        const state = useGuestStore.getState();
        const oldTx = state.transactions.find((t) => t.id === id);
        if (!oldTx) throw new Error("Transaction not found");

        let finalAttachmentUrl = oldTx.attachmentUrl;
        if (data.file) {
          finalAttachmentUrl = URL.createObjectURL(data.file);
        } else if (data.attachmentUrl === null) {
          finalAttachmentUrl = undefined;
        }

        const mock = createMockTransaction(data.type, data, state);
        return {
          ...oldTx,
          ...mock,
          id: oldTx.id,
          createdAt: oldTx.createdAt,
          attachmentUrl: finalAttachmentUrl,
        };
      }
      return updateTransactionApi(id, data);
    },
    ...options,
    onSuccess: (data) => {
      if (isGuest) {
        updateTransaction(data.id, data);
      } else {
        invalidateQueries(queryClient);
      }
      options?.onSuccess?.(data);
    },
  });
};

export const useTransactionsQuery = (params?: TransactionQuery) => {
  const isGuest = useIsGuest();
  const guestTransactions = useGuestStore((state) => state.transactions);

  return useQuery<PaginatedTransactionResponse, AxiosError<ApiErrorResponse>>({
    queryKey: ["transactions", params],
    queryFn: () => getTransactionsApi(params),
    enabled: !isGuest,
    initialData: isGuest
      ? {
          items: guestTransactions,
          meta: {
            page: 1,
            limit: 10,
            total: guestTransactions.length,
            totalPages: 1,
          },
        }
      : undefined,
  });
};

export const useDeleteTransactionMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  const isGuest = useGuestStore((state) => state.isGuest);
  const deleteTransaction = useGuestStore((state) => state.deleteTransaction);

  return useMutation<
    void,
    AxiosError<ApiErrorResponse>,
    { id: string; isHardDelete?: boolean }
  >({
    mutationFn: async ({ id, isHardDelete }) => {
      if (isGuest) {
        return;
      }
      return deleteTransactionApi(id, isHardDelete);
    },
    ...options,
    onSuccess: (_, variables) => {
      if (isGuest) {
        deleteTransaction(variables.id);
      } else {
        invalidateQueries(queryClient);
      }
      options?.onSuccess?.();
    },
  });
};
