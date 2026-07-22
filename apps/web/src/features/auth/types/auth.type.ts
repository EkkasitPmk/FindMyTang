import { SyncGuestResponse as ZodSyncGuestResponse } from "../schemas/auth.response.schema";

export interface SyncGuestRequest {
  assets?: Array<{
    id?: string;
    localId?: string;
    name: string;
    type: string;
    balance?: number;
    color?: string | null;
    isArchived?: boolean;
    displayOrder?: number;
  }>;
  categories?: Array<{
    id?: string;
    localId?: string;
    name: string;
    type: string;
    color?: string | null;
    icon?: string | null;
    isSystem?: boolean;
    displayOrder?: number;
  }>;
  transactions?: Array<{
    id?: string;
    localId?: string;
    type: string;
    amount: number;
    date: string;
    assetId?: string;
    localAssetId?: string;
    toAssetId?: string | null;
    localToAssetId?: string | null;
    categoryId?: string | null;
    localCategoryId?: string | null;
    note?: string | null;
    attachmentUrl?: string | null;
  }>;
}

export type SyncGuestResponse = ZodSyncGuestResponse;
