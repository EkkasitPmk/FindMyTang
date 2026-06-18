import { Asset } from "@/features/assets/types/assets.type";
import { Category } from "@/features/category/types/category.type";
import { TransactionResponse } from "@/features/transactions/types/transaction.type";

export interface SyncGuestRequest {
  assets: Asset[];
  categories: Category[];
  transactions: TransactionResponse[];
}

export interface SyncGuestResponse {
  success: boolean;
  syncedCount: {
    assets: number;
    categories: number;
    transactions: number;
  };
}
