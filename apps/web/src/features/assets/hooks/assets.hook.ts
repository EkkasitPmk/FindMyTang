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
  return useMutation<
    CreateAssetResponse,
    AxiosError<ApiErrorResponse>,
    CreateAssetRequest
  >({
    mutationFn: createAssetApi,
    ...options,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["assets"] });
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
    { id: string; data: Partial<CreateAssetRequest> }
  >({
    mutationFn: ({ id, data }) => updateAssetApi(id, data),
    ...options,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["assets"] });
      options?.onSuccess?.(data);
    },
  });
};

export const useAssets = () => {
  return useQuery<Asset[], AxiosError<ApiErrorResponse>>({
    queryKey: ["assets"],
    queryFn: getAssetsApi,
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
    string
  >({
    mutationFn: deleteAssetApi,
    ...options,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["assets"] });
      options?.onSuccess?.(data);
    },
  });
};
