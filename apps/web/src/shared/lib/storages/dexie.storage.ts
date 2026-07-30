import Dexie, { type Table } from "dexie";
import { AssetType } from "../types/asset.type";

export enum CategoryType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  TRANSFER = "TRANSFER",
  ADJUSTMENT = "ADJUSTMENT",
}

export type SyncStatus = "synced" | "pending" | "error";

export interface LocalAsset {
  id: string;
  name: string;
  type: AssetType;
  balance: number;
  color?: string | null;
  displayOrder: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  // For tracking sync status in the future
  syncStatus?: SyncStatus;
}

export interface LocalCategory {
  id: string;
  name: string;
  type: CategoryType;
  color?: string | null;
  icon?: string | null;
  displayOrder: number;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  syncStatus?: SyncStatus;
}

export interface LocalTransaction {
  id: string;
  amount: number;
  date: string;
  type: TransactionType;
  assetId: string;
  categoryId?: string | null;
  toAssetId?: string | null;
  note?: string | null;
  attachmentUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  syncStatus?: SyncStatus;
}

export class FindMyTangDexie extends Dexie {
  assets!: Table<LocalAsset, string>;
  categories!: Table<LocalCategory, string>;
  transactions!: Table<LocalTransaction, string>;

  constructor() {
    super("FindMyTangDB");
    this.version(1).stores({
      // We only specify indexed fields here.
      assets: "id, type, isArchived, displayOrder, deletedAt, syncStatus",
      categories: "id, type, isSystem, displayOrder, deletedAt, syncStatus",
      transactions:
        "id, type, date, assetId, categoryId, toAssetId, deletedAt, syncStatus",
    });
  }
}

export const db = new FindMyTangDexie();
