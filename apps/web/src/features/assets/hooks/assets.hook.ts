import {
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import { create } from "zustand";
import {
  createAssetApi,
  updateAssetApi,
  deleteAssetApi,
  restoreAssetApi,
  bulkDeleteAssetsApi,
  bulkArchiveAssetsApi,
  bulkRestoreAssetsApi,
  reorderAssetsApi,
} from "../services/assets.service";
import {
  CreateAssetRequest,
  UpdateAssetRequest,
  CreateAssetResponse,
  Asset,
} from "@/shared/lib/types/asset.type";
import { AxiosError } from "axios";

import { ApiErrorResponse } from "@/shared/lib/types/api.type";

const invalidateQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["assets"] }).catch(() => {});
  queryClient.invalidateQueries({ queryKey: ["transactions"] }).catch(() => {});
  queryClient.invalidateQueries({ queryKey: ["summary"] }).catch(() => {});
  queryClient.invalidateQueries({ queryKey: ["analytics"] }).catch(() => {});
};

export const useCreateAssetMutation = (options?: {
  onSuccess?: (data: CreateAssetResponse) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateAssetResponse,
    AxiosError<ApiErrorResponse>,
    CreateAssetRequest
  >({
    mutationFn: (data) => createAssetApi(data),
    ...options,
    onSuccess: (data) => {
      invalidateQueries(queryClient);
      options?.onSuccess?.(data);
    },
  });
};

export const useUpdateAssetMutation = (options?: {
  onSuccess?: (data: CreateAssetResponse) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateAssetResponse,
    AxiosError<ApiErrorResponse>,
    { id: string; data: UpdateAssetRequest }
  >({
    mutationFn: ({ id, data }) => updateAssetApi(id, data),
    ...options,
    onSuccess: async (data) => {
      // ponytail: Optimistic update to make UI feel instant.
      queryClient.setQueriesData<Asset[]>({ queryKey: ["assets"] }, (oldData) =>
        oldData?.map((asset) =>
          asset.id === data.id ? { ...asset, ...data } : asset,
        ),
      );
      // Let background refetch ensure everything is in sync.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["assets"] }),
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["summary"] }),
        queryClient.invalidateQueries({ queryKey: ["analytics"] }),
      ]);
      options?.onSuccess?.(data);
    },
  });
};

export const useDeleteAssetMutation = (options?: {
  onSuccess?: (data: Asset) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<
    Asset,
    AxiosError<ApiErrorResponse>,
    { id: string; hardDelete?: boolean }
  >({
    mutationFn: ({ id, hardDelete }) => deleteAssetApi(id, hardDelete),
    ...options,
    onSuccess: (data) => {
      invalidateQueries(queryClient);
      options?.onSuccess?.(data);
    },
  });
};

export const useRestoreAssetMutation = (options?: {
  onSuccess?: (data: Asset) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<Asset, AxiosError<ApiErrorResponse>, string>({
    mutationFn: (id) => restoreAssetApi(id),
    ...options,
    onSuccess: (data) => {
      invalidateQueries(queryClient);
      options?.onSuccess?.(data);
    },
  });
};

export const useBulkDeleteAssetsMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    AxiosError<ApiErrorResponse>,
    { ids: string[]; hardDelete?: boolean }
  >({
    mutationFn: ({ ids, hardDelete }) => bulkDeleteAssetsApi(ids, hardDelete),
    ...options,
    onSuccess: () => {
      invalidateQueries(queryClient);
      options?.onSuccess?.();
    },
  });
};

export const useReorderAssetsMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    AxiosError<ApiErrorResponse>,
    string[]
  >({
    mutationFn: (ids) => reorderAssetsApi(ids),
    ...options,
    onSuccess: () => {
      invalidateQueries(queryClient);
      options?.onSuccess?.();
    },
  });
};

export const useBulkArchiveAssetsMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    AxiosError<ApiErrorResponse>,
    { ids: string[] }
  >({
    mutationFn: ({ ids }) => bulkArchiveAssetsApi(ids),
    ...options,
    onSuccess: () => {
      invalidateQueries(queryClient);
      options?.onSuccess?.();
    },
  });
};

export const useBulkRestoreAssetsMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    AxiosError<ApiErrorResponse>,
    { ids: string[] }
  >({
    mutationFn: ({ ids }) => bulkRestoreAssetsApi(ids),
    ...options,
    onSuccess: () => {
      invalidateQueries(queryClient);
      options?.onSuccess?.();
    },
  });
};

interface AssetUIStore {
  isEditingList: boolean;
  toggleEditingList: () => void;
  setEditingList: (value: boolean) => void;
  hasAssets: boolean;
  setHasAssets: (value: boolean) => void;
  isSearchMode: boolean;
  setSearchMode: (value: boolean) => void;
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  filterType: "ALL" | "INCOME" | "EXPENSE" | "TRANSFER" | "ADJUSTMENT";
  setFilterType: (
    value: "ALL" | "INCOME" | "EXPENSE" | "TRANSFER" | "ADJUSTMENT",
  ) => void;
  sortType: "DATE_NEWEST" | "DATE_OLDEST" | "AMOUNT_HIGHEST" | "AMOUNT_LOWEST";
  setSortType: (
    value: "DATE_NEWEST" | "DATE_OLDEST" | "AMOUNT_HIGHEST" | "AMOUNT_LOWEST",
  ) => void;
  resetFilters: () => void;
}

export const useAssetUIStore = create<AssetUIStore>((set) => ({
  isEditingList: false,
  toggleEditingList: () =>
    set((state) => ({ isEditingList: !state.isEditingList })),
  setEditingList: (value) => set({ isEditingList: value }),
  hasAssets: true,
  setHasAssets: (value) => set({ hasAssets: value }),
  isSearchMode: false,
  setSearchMode: (value) => set({ isSearchMode: value }),
  searchKeyword: "",
  setSearchKeyword: (value) => set({ searchKeyword: value }),
  filterType: "ALL",
  setFilterType: (value) => set({ filterType: value }),
  sortType: "DATE_NEWEST",
  setSortType: (value) => set({ sortType: value }),
  resetFilters: () =>
    set({
      isSearchMode: false,
      searchKeyword: "",
      filterType: "ALL",
      sortType: "DATE_NEWEST",
    }),
}));
