import http from "@/shared/lib/api/http";
import {
  CreateAssetRequest,
  CreateAssetResponse,
  Asset,
} from "../types/assets.type";

export const createAssetApi = async (
  data: CreateAssetRequest,
): Promise<CreateAssetResponse> => {
  const response = await http.post<CreateAssetResponse>("/assets", data);
  return response.data;
};

export const getAssetsApi = async (): Promise<Asset[]> => {
  const response = await http.get<Asset[]>("/assets");
  return response.data;
};

export const updateAssetApi = async (
  id: string,
  data: Partial<CreateAssetRequest>,
): Promise<CreateAssetResponse> => {
  const response = await http.patch<CreateAssetResponse>(`/assets/${id}`, data);
  return response.data;
};

export const deleteAssetApi = async (id: string): Promise<Asset> => {
  const response = await http.delete<Asset>(`/assets/${id}`);
  return response.data;
};
