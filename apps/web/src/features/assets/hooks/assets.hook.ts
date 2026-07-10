import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import {
  createAssetApi,
  getAssetsApi,
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
} from "../types/assets.type";
import { AxiosError } from "axios";
import { useGuestStore, useIsGuest } from "@/shared/lib/storages/guest.storage";

export interface ApiErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

export const useCreateAssetMutation = (options?: {
  onSuccess?: (data: CreateAssetResponse) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  const isGuest = useGuestStore((state) => state.isGuest);
  const addAsset = useGuestStore((state) => state.addAsset);

  return useMutation<
    CreateAssetResponse,
    AxiosError<ApiErrorResponse>,
    CreateAssetRequest
  >({
    mutationFn: async (data) => {
      if (isGuest) {
        const mockResponse: Asset = {
          id: crypto.randomUUID(),
          name: data.name,
          type: data.type,
          balance: data.balance ?? 0,
          color: data.color,
          isArchived: false,
          deletedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return mockResponse;
      }
      return createAssetApi(data);
    },
    ...options,
    onSuccess: (data) => {
      if (isGuest) {
        addAsset(data);
      } else {
        void queryClient.invalidateQueries({ queryKey: ["assets"] });
      }
      options?.onSuccess?.(data);
    },
  });
};

export const useUpdateAssetMutation = (options?: {
  onSuccess?: (data: CreateAssetResponse) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  const isGuest = useGuestStore((state) => state.isGuest);
  const updateAsset = useGuestStore((state) => state.updateAsset);

  return useMutation<
    CreateAssetResponse,
    AxiosError<ApiErrorResponse>,
    { id: string; data: UpdateAssetRequest }
  >({
    mutationFn: async ({ id, data }) => {
      if (isGuest) {
        const state = useGuestStore.getState();
        const existingAsset = state.assets.find((a) => a.id === id);
        if (!existingAsset) {
          throw new Error("Asset not found");
        }
        const mockResponse: Asset = {
          ...existingAsset,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        return mockResponse;
      }
      return updateAssetApi(id, data);
    },
    ...options,
    onSuccess: (data) => {
      if (isGuest) {
        updateAsset(data.id, data);
      } else {
        void queryClient.invalidateQueries({ queryKey: ["assets"] });
      }
      options?.onSuccess?.(data);
    },
  });
};

export const useAssets = (options?: { includeDeleted?: boolean }) => {
  const isGuest = useIsGuest();
  const guestAssets = useGuestStore((state) => state.assets);
  const includeDeleted = options?.includeDeleted ?? false;

  return useQuery<Asset[], AxiosError<ApiErrorResponse>>({
    queryKey: ["assets", { includeDeleted }],
    queryFn: () => getAssetsApi(includeDeleted),
    enabled: !isGuest,
    initialData: isGuest ? guestAssets : undefined,
  });
};

export const useDeleteAssetMutation = (options?: {
  onSuccess?: (data: Asset) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  const isGuest = useGuestStore((state) => state.isGuest);
  const deleteAsset = useGuestStore((state) => state.deleteAsset);
  const updateAsset = useGuestStore((state) => state.updateAsset);

  return useMutation<
    Asset,
    AxiosError<ApiErrorResponse>,
    { id: string; hardDelete?: boolean }
  >({
    mutationFn: async ({ id, hardDelete }) => {
      if (isGuest) {
        const state = useGuestStore.getState();
        const existingAsset = state.assets.find((a) => a.id === id);
        if (!existingAsset) {
          throw new Error("Asset not found");
        }
        if (hardDelete) {
          return existingAsset;
        }
        return {
          ...existingAsset,
          deletedAt: new Date().toISOString(),
        };
      }
      return deleteAssetApi(id, hardDelete);
    },
    ...options,
    onSuccess: (data, variables) => {
      if (isGuest) {
        if (variables.hardDelete) {
          deleteAsset(data.id);
        } else {
          updateAsset(data.id, { deletedAt: data.deletedAt });
        }
      } else {
        void queryClient.invalidateQueries({ queryKey: ["assets"] });
      }
      options?.onSuccess?.(data);
    },
  });
};

export const useRestoreAssetMutation = (options?: {
  onSuccess?: (data: Asset) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  const isGuest = useGuestStore((state) => state.isGuest);
  const updateAsset = useGuestStore((state) => state.updateAsset);

  return useMutation<Asset, AxiosError<ApiErrorResponse>, string>({
    mutationFn: async (id) => {
      if (isGuest) {
        const state = useGuestStore.getState();
        const existingAsset = state.assets.find((a) => a.id === id);
        if (!existingAsset) {
          throw new Error("Asset not found");
        }
        return {
          ...existingAsset,
          deletedAt: null,
        };
      }
      return restoreAssetApi(id);
    },
    ...options,
    onSuccess: (data) => {
      if (isGuest) {
        updateAsset(data.id, { deletedAt: null });
      } else {
        void queryClient.invalidateQueries({ queryKey: ["assets"] });
      }
      options?.onSuccess?.(data);
    },
  });
};

export const useBulkDeleteAssetsMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  const isGuest = useGuestStore((state) => state.isGuest);
  const deleteAsset = useGuestStore((state) => state.deleteAsset);
  const updateAsset = useGuestStore((state) => state.updateAsset);

  return useMutation<
    { success: boolean },
    AxiosError<ApiErrorResponse>,
    { ids: string[]; hardDelete?: boolean }
  >({
    mutationFn: async ({ ids, hardDelete }) => {
      if (isGuest) {
        // Mock bulk delete
        return { success: true };
      }
      return bulkDeleteAssetsApi(ids, hardDelete);
    },
    ...options,
    onSuccess: (data, variables) => {
      if (isGuest) {
        if (variables.hardDelete) {
          variables.ids.forEach((id) => deleteAsset(id));
        } else {
          variables.ids.forEach((id) =>
            updateAsset(id, { deletedAt: new Date().toISOString() }),
          );
        }
      } else {
        void queryClient.invalidateQueries({ queryKey: ["assets"] });
      }
      options?.onSuccess?.();
    },
  });
};

export const useReorderAssetsMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  const isGuest = useGuestStore((state) => state.isGuest);

  return useMutation<
    { success: boolean },
    AxiosError<ApiErrorResponse>,
    string[]
  >({
    mutationFn: async (ids) => {
      if (isGuest) {
        const state = useGuestStore.getState();
        const reorderedAssets: Asset[] = [];
        ids.forEach((id) => {
          const asset = state.assets.find((a) => a.id === id);
          if (asset) reorderedAssets.push(asset);
        });
        state.assets.forEach((asset) => {
          if (!ids.includes(asset.id)) {
            reorderedAssets.push(asset);
          }
        });
        reorderedAssets.forEach((asset, idx) => {
          asset.displayOrder = idx + 1;
        });
        useGuestStore.setState({ assets: reorderedAssets });
        return { success: true };
      }
      return reorderAssetsApi(ids);
    },
    ...options,
    onSuccess: () => {
      if (!isGuest) {
        void queryClient.invalidateQueries({ queryKey: ["assets"] });
      }
      options?.onSuccess?.();
    },
  });
};

export const useBulkArchiveAssetsMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  const isGuest = useGuestStore((state) => state.isGuest);
  const updateAsset = useGuestStore((state) => state.updateAsset);

  return useMutation<
    { success: boolean },
    AxiosError<ApiErrorResponse>,
    { ids: string[] }
  >({
    mutationFn: async ({ ids }) => {
      if (isGuest) {
        ids.forEach((id) => {
          updateAsset(id, { isArchived: true });
        });
        return { success: true };
      }
      return bulkArchiveAssetsApi(ids);
    },
    ...options,
    onSuccess: () => {
      if (!isGuest) {
        void queryClient.invalidateQueries({ queryKey: ["assets"] });
      }
      options?.onSuccess?.();
    },
  });
};

export const useBulkRestoreAssetsMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  const isGuest = useGuestStore((state) => state.isGuest);
  const updateAsset = useGuestStore((state) => state.updateAsset);

  return useMutation<
    { success: boolean },
    AxiosError<ApiErrorResponse>,
    { ids: string[] }
  >({
    mutationFn: async ({ ids }) => {
      if (isGuest) {
        ids.forEach((id) => {
          updateAsset(id, { deletedAt: null, isArchived: false });
        });
        return { success: true };
      }
      return bulkRestoreAssetsApi(ids);
    },
    ...options,
    onSuccess: () => {
      if (!isGuest) {
        void queryClient.invalidateQueries({ queryKey: ["assets"] });
      }
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
}

export const useAssetUIStore = create<AssetUIStore>((set) => ({
  isEditingList: false,
  toggleEditingList: () =>
    set((state) => ({ isEditingList: !state.isEditingList })),
  setEditingList: (value) => set({ isEditingList: value }),
  hasAssets: true,
  setHasAssets: (value) => set({ hasAssets: value }),
}));
