import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createExpenseApi,
  createIncomeApi,
  createTransferApi,
  createAdjustmentApi,
  getTransactionsApi,
} from "../services/transaction.service";
import {
  CreateExpenseRequest,
  CreateIncomeRequest,
  CreateTransferRequest,
  CreateAdjustmentRequest,
  TransactionResponse,
  TransactionQuery,
  PaginatedTransactionResponse,
} from "../types/transaction.type";
import { AxiosError } from "axios";
import { useGuestStore, useIsGuest } from "@/shared/lib/store/guest-store";

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
  const isGuest = useGuestStore((state) => state.isGuest);
  const addTransaction = useGuestStore((state) => state.addTransaction);

  return useMutation<
    TransactionResponse,
    AxiosError<ApiErrorResponse>,
    CreateExpenseRequest
  >({
    mutationFn: async (data) => {
      if (isGuest) {
        const state = useGuestStore.getState();
        const asset = state.assets.find((a) => a.id === data.assetId);
        const category = state.categories.find((c) => c.id === data.categoryId);

        const mockResponse: TransactionResponse = {
          id: crypto.randomUUID(),
          type: "EXPENSE",
          amount: data.amount,
          note: data.note,
          transactionDate: data.transactionDate,
          assetId: data.assetId,
          categoryId: data.categoryId,
          asset: asset ? { ...asset } : undefined,
          category: category ? { ...category } : undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return mockResponse;
      }
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
        queryClient.invalidateQueries({ queryKey: ["assets"] }).catch(() => {});
        queryClient
          .invalidateQueries({ queryKey: ["transactions"] })
          .catch(() => {});
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
      if (isGuest) {
        const state = useGuestStore.getState();
        const asset = state.assets.find((a) => a.id === data.assetId);
        const category = state.categories.find((c) => c.id === data.categoryId);

        const mockResponse: TransactionResponse = {
          id: crypto.randomUUID(),
          type: "INCOME",
          amount: data.amount,
          note: data.note,
          transactionDate: data.transactionDate,
          assetId: data.assetId,
          categoryId: data.categoryId,
          asset: asset ? { ...asset } : undefined,
          category: category ? { ...category } : undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return mockResponse;
      }
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
        queryClient.invalidateQueries({ queryKey: ["assets"] }).catch(() => {});
        queryClient
          .invalidateQueries({ queryKey: ["transactions"] })
          .catch(() => {});
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
      if (isGuest) {
        const state = useGuestStore.getState();
        const asset = state.assets.find((a) => a.id === data.assetId);
        const toAsset = state.assets.find((a) => a.id === data.toAssetId);

        const mockResponse: TransactionResponse = {
          id: crypto.randomUUID(),
          type: "TRANSFER",
          amount: data.amount,
          note: data.note,
          transactionDate: data.transactionDate,
          assetId: data.assetId,
          toAssetId: data.toAssetId,
          asset: asset ? { ...asset } : undefined,
          toAsset: toAsset ? { ...toAsset } : undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return mockResponse;
      }
      return createTransferApi(data);
    },
    ...options,
    onSuccess: (data) => {
      if (isGuest) {
        addTransaction(data);
        const state = useGuestStore.getState();
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
      } else {
        queryClient.invalidateQueries({ queryKey: ["assets"] }).catch(() => {});
        queryClient
          .invalidateQueries({ queryKey: ["transactions"] })
          .catch(() => {});
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
      if (isGuest) {
        const state = useGuestStore.getState();
        const asset = state.assets.find((a) => a.id === data.assetId);

        const mockResponse: TransactionResponse = {
          id: crypto.randomUUID(),
          type: "ADJUSTMENT",
          amount: data.amount,
          note: data.note,
          transactionDate: data.transactionDate,
          assetId: data.assetId,
          asset: asset ? { ...asset } : undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return mockResponse;
      }
      return createAdjustmentApi(data);
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
        queryClient.invalidateQueries({ queryKey: ["assets"] }).catch(() => {});
        queryClient
          .invalidateQueries({ queryKey: ["transactions"] })
          .catch(() => {});
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
