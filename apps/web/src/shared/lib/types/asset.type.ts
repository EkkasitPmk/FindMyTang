import { AssetResponse } from "@/features/assets/schemas/assets.response.schema";

export enum AssetType {
  CASH = "CASH",
  BANK = "BANK",
  E_WALLET = "E_WALLET",
  INVESTMENT = "INVESTMENT",
  CRYPTO = "CRYPTO",
  OTHER = "OTHER",
}

export interface CreateAssetRequest {
  name: string;
  type: AssetType;
  balance?: number;
  color?: string;
}

export interface UpdateAssetRequest extends Partial<CreateAssetRequest> {
  isArchived?: boolean;
}

export type CreateAssetResponse = AssetResponse;
export type Asset = AssetResponse;
