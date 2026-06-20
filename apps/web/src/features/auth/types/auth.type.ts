import { AssetType } from "@/features/assets/types/assets.type";
import { CategoryType } from "@/features/category/types/category.type";
import { TransactionType } from "@/features/transactions/types/transaction.type";

export interface SyncAssetItem {
  localId: string;
  name: string;
  type: AssetType;
  balance?: number;
  color?: string;
}

export interface SyncCategoryItem {
  localId: string;
  name: string;
  type: CategoryType;
  color?: string;
  icon?: string;
}

export interface SyncTransactionItem {
  localId: string;
  localAssetId: string;
  localToAssetId?: string;
  localCategoryId?: string;
  type: TransactionType;
  amount: number;
  note?: string;
  date: string;
}

export interface SyncGuestRequest {
  assets: SyncAssetItem[];
  categories: SyncCategoryItem[];
  transactions: SyncTransactionItem[];
}

export interface SyncGuestResponse {
  success: boolean;
}
