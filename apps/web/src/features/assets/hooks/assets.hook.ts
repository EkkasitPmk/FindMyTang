import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAssetApi,
  getAssetsApi,
  updateAssetApi,
  deleteAssetApi,
} from "../services/assets.service";
import {
  CreateAssetRequest,
  CreateAssetResponse,
  Asset,
} from "../types/assets.type";
import { AxiosError } from "axios";
import { useGuestStore, useIsGuest } from "@/shared/lib/store/guest-store";

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
        addAsset(data as Asset);
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
    { id: string; data: Partial<CreateAssetRequest> }
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
        } as Asset;
        return mockResponse;
      }
      return updateAssetApi(id, data);
    },
    ...options,
    onSuccess: (data) => {
      if (isGuest) {
        updateAsset(data.id, data as Partial<Asset>);
      } else {
        void queryClient.invalidateQueries({ queryKey: ["assets"] });
      }
      options?.onSuccess?.(data);
    },
  });
};

export const useAssets = () => {
  const isGuest = useIsGuest();
  const guestAssets = useGuestStore((state) => state.assets);

  return useQuery<Asset[], AxiosError<ApiErrorResponse>>({
    queryKey: ["assets"],
    queryFn: getAssetsApi,
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

  return useMutation<Asset, AxiosError<ApiErrorResponse>, string>({
    mutationFn: async (id) => {
      if (isGuest) {
        const state = useGuestStore.getState();
        const existingAsset = state.assets.find((a) => a.id === id);
        if (!existingAsset) {
          throw new Error("Asset not found");
        }
        return existingAsset;
      }
      return deleteAssetApi(id);
    },
    ...options,
    onSuccess: (data) => {
      if (isGuest) {
        deleteAsset(data.id);
      } else {
        void queryClient.invalidateQueries({ queryKey: ["assets"] });
      }
      options?.onSuccess?.(data);
    },
  });
};
