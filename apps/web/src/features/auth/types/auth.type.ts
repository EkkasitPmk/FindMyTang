import { AssetType } from "@/features/assets/types/assets.type";
import { CategoryType } from "@/features/category/types/category.type";
import { TransactionType } from "@/features/transactions/types/transaction.type";

export interface SyncAssetItem {
  localId: string;
  name: string;
  type: AssetType;
  balance?: number;
  color?: string;
  displayOrder?: number;
  isArchived?: boolean;
  deletedAt?: string | null;
}

export interface SyncCategoryItem {
  localId: string;
  name: string;
  type: CategoryType;
  color?: string;
  icon?: string;
  displayOrder?: number;
  isSystem?: boolean;
  deletedAt?: string | null;
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
  attachmentUrl?: string | null;
  deletedAt?: string | null;
}

export interface SyncGuestRequest {
  assets: SyncAssetItem[];
  categories: SyncCategoryItem[];
  transactions: SyncTransactionItem[];
}

export interface SyncGuestResponse {
  success: boolean;
}
