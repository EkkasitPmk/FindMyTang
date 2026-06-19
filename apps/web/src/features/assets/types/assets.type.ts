export enum AssetType {
  CASH = "CASH",
  BANK = "BANK",
  E_WALLET = "E-WALLET",
  CREDIT_CARD = "CREDIT CARD",
  INVESTMENT = "INVESTMENT",
  CRYPTO = "CRYPTO",
  OTHER = "OTHER",
}

export interface CreateAssetRequest {
  name: string;
  type: AssetType;
  balance?: number;
}

export interface CreateAssetResponse {
  id: string;
  name: string;
  type: AssetType;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  balance: number;
  createdAt: string;
  updatedAt: string;
}
