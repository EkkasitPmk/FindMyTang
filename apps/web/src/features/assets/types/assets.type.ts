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

export interface CreateAssetResponse {
  id: string;
  name: string;
  type: AssetType;
  balance: number;
  color?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  balance: number;
  color?: string | null;
  createdAt: string;
  updatedAt: string;
}
