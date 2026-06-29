import {
  useMutation,
  useQuery,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import {
  createExpenseApi,
  createIncomeApi,
  createTransferApi,
  createAdjustmentApi,
  getTransactionsApi,
  updateTransactionApi,
} from "../services/transaction.service";
import {
  CreateExpenseRequest,
  CreateIncomeRequest,
  CreateTransferRequest,
  CreateAdjustmentRequest,
  TransactionResponse,
  TransactionQuery,
  PaginatedTransactionResponse,
  UpdateTransactionRequest,
  TransactionType,
} from "../types/transaction.type";
import { AxiosError } from "axios";
import { useGuestStore, useIsGuest } from "@/shared/lib/store/guest-store";

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

export const useCreateExpenseMutation = (options?: {
  onSuccess?: (data: TransactionResponse) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  const isGuest = useGuestStore((state) => state.isGuest);
  const addTransaction = useGuestStore((state) => state.addTransaction);

  return useMutation<
    TransactionResponse,
    AxiosError<ApiErrorResponse>,
    CreateExpenseRequest
  >({
    mutationFn: async (data) => {
      if (isGuest)
        return createMockTransaction("EXPENSE", data, useGuestStore.getState());
      return createExpenseApi(data);
    },
    ...options,
    onSuccess: (data) => {
      if (isGuest) {
        addTransaction(data);
        const state = useGuestStore.getState();
        const asset = state.assets.find((a) => a.id === data.assetId);
        if (asset) {
          state.updateAsset(asset.id, { balance: asset.balance - data.amount });
        }
      } else {
        invalidateQueries(queryClient);
      }
      options?.onSuccess?.(data);
    },
  });
};

export const useCreateIncomeMutation = (options?: {
  onSuccess?: (data: TransactionResponse) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  const isGuest = useGuestStore((state) => state.isGuest);
  const addTransaction = useGuestStore((state) => state.addTransaction);

  return useMutation<
    TransactionResponse,
    AxiosError<ApiErrorResponse>,
    CreateIncomeRequest
  >({
    mutationFn: async (data) => {
      if (isGuest)
        return createMockTransaction("INCOME", data, useGuestStore.getState());
      return createIncomeApi(data);
    },
    ...options,
    onSuccess: (data) => {
      if (isGuest) {
        addTransaction(data);
        const state = useGuestStore.getState();
        const asset = state.assets.find((a) => a.id === data.assetId);
        if (asset) {
          state.updateAsset(asset.id, { balance: asset.balance + data.amount });
        }
      } else {
        invalidateQueries(queryClient);
      }
      options?.onSuccess?.(data);
    },
  });
};

export const useCreateTransferMutation = (options?: {
  onSuccess?: (data: TransactionResponse) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  const isGuest = useGuestStore((state) => state.isGuest);
  const addTransaction = useGuestStore((state) => state.addTransaction);

  return useMutation<
    TransactionResponse,
    AxiosError<ApiErrorResponse>,
    CreateTransferRequest
  >({
    mutationFn: async (data) => {
      if (isGuest)
        return createMockTransaction(
          "TRANSFER",
          data,
          useGuestStore.getState(),
        );
      return createTransferApi(data);
    },
    ...options,
    onSuccess: (data) => {
      if (isGuest) {
        addTransaction(data);
        const state = useGuestStore.getState();
        const fromAsset = state.assets.find((a) => a.id === data.assetId);
        const toAsset = state.assets.find((a) => a.id === data.toAssetId);
        if (fromAsset)
          state.updateAsset(fromAsset.id, {
            balance: fromAsset.balance - data.amount,
          });
        if (toAsset)
          state.updateAsset(toAsset.id, {
            balance: toAsset.balance + data.amount,
          });
      } else {
        invalidateQueries(queryClient);
      }
      options?.onSuccess?.(data);
    },
  });
};

export const useCreateAdjustmentMutation = (options?: {
  onSuccess?: (data: TransactionResponse) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  const isGuest = useGuestStore((state) => state.isGuest);
  const addTransaction = useGuestStore((state) => state.addTransaction);

  return useMutation<
    TransactionResponse,
    AxiosError<ApiErrorResponse>,
    CreateAdjustmentRequest
  >({
    mutationFn: async (data) => {
      if (isGuest)
        return createMockTransaction(
          "ADJUSTMENT",
          data,
          useGuestStore.getState(),
        );
      return createAdjustmentApi(data);
    },
    ...options,
    onSuccess: (data) => {
      if (isGuest) {
        addTransaction(data);
        const state = useGuestStore.getState();
        const asset = state.assets.find((a) => a.id === data.assetId);
        if (asset)
          state.updateAsset(asset.id, { balance: asset.balance + data.amount });
      } else {
        invalidateQueries(queryClient);
      }
      options?.onSuccess?.(data);
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
