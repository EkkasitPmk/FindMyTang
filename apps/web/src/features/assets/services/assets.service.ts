import http from "@/shared/lib/api/http";
import {
  CreateAssetRequest,
  UpdateAssetRequest,
  CreateAssetResponse,
  Asset,
} from "../types/assets.type";

export const createAssetApi = async (
  data: CreateAssetRequest,
): Promise<CreateAssetResponse> => {
  const response = await http.post<CreateAssetResponse>("/assets", data);
  return response.data;
};

export const getAssetsApi = async (
  includeDeleted = false,
): Promise<Asset[]> => {
  const query = includeDeleted ? "?includeDeleted=true" : "";
  const response = await http.get<Asset[]>(`/assets${query}`);
  return response.data;
};

export const updateAssetApi = async (
  id: string,
  data: UpdateAssetRequest,
): Promise<CreateAssetResponse> => {
  const response = await http.patch<CreateAssetResponse>(`/assets/${id}`, data);
  return response.data;
};

export const restoreAssetApi = async (id: string): Promise<Asset> => {
  const response = await http.patch<Asset>(`/assets/${id}/restore`);
  return response.data;
};

export const deleteAssetApi = async (
  id: string,
  hardDelete?: boolean,
): Promise<Asset> => {
  const query = hardDelete ? "?hard=true" : "";
  const response = await http.delete<Asset>(`/assets/${id}${query}`);
  return response.data;
};

export const bulkDeleteAssetsApi = async (
  ids: string[],
  hardDelete?: boolean,
): Promise<{ success: boolean }> => {
  const query = hardDelete ? "?hard=true" : "";
  const response = await http.post<{ success: boolean }>(
    `/assets/bulk-delete${query}`,
    { ids },
  );
  return response.data;
};

export const bulkArchiveAssetsApi = async (
  ids: string[],
): Promise<{ success: boolean }> => {
  const response = await http.post<{ success: boolean }>(
    "/assets/bulk-archive",
    {
      ids,
    },
  );
  return response.data;
};

export const bulkRestoreAssetsApi = async (
  ids: string[],
): Promise<{ success: boolean }> => {
  const response = await http.post<{ success: boolean }>(
    "/assets/bulk-restore",
    {
      ids,
    },
  );
  return response.data;
};

export const reorderAssetsApi = async (
  ids: string[],
): Promise<{ success: boolean }> => {
  const response = await http.patch<{ success: boolean }>("/assets/reorder", {
    ids,
  });
  return response.data;
};
