export enum AssetType {
  CASH = "CASH",
  BANK = "BANK",
  E_WALLET = "E_WALLET",
  CREDIT_CARD = "CREDIT_CARD",
}

export interface CreateAssetRequest {
  name: string;
  type: AssetType;
  balance?: number;
  currency?: string;
}

export interface CreateAssetResponse {
  id: string;
  name: string;
  type: AssetType;
  balance: number;
  currency: string;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  balance: number;
  currency: string;
}
