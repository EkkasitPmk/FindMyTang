export interface CreateExpenseRequest {
  assetId: string;
  categoryId: string;
  amount: number;
  note?: string;
  transactionDate: string;
  attachmentUrl?: string;
  file?: File;
}

export interface CreateIncomeRequest {
  assetId: string;
  categoryId: string;
  amount: number;
  note?: string;
  transactionDate: string;
  attachmentUrl?: string;
  file?: File;
}

export interface CreateTransferRequest {
  assetId: string;
  toAssetId: string;
  amount: number;
  note?: string;
  transactionDate: string;
  attachmentUrl?: string;
  file?: File;
}

export interface CreateAdjustmentRequest {
  assetId: string;
  amount: number;
  note?: string;
  transactionDate: string;
  attachmentUrl?: string;
  file?: File;
}

export interface UpdateTransactionRequest {
  type: TransactionType;
  assetId: string;
  amount: number;
  note?: string;
  transactionDate: string;
  toAssetId?: string;
  categoryId?: string;
  attachmentUrl?: string | null;
  file?: File | null;
}

export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER" | "ADJUSTMENT";

export interface TransactionResponse {
  id: string;
  type: TransactionType;
  amount: number;
  note?: string;
  transactionDate: string;
  assetId: string;
  toAssetId?: string | null;
  categoryId?: string;
  attachmentUrl?: string | null;
  asset?: {
    id: string;
    name: string;
    type: string;
    balance: number;
  };
  toAsset?: {
    id: string;
    name: string;
    type: string;
    balance: number;
  } | null;
  category?: {
    id: string;
    name: string;
    type: string;
    color?: string;
    icon?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TransactionQuery {
  page?: number;
  limit?: number;
  type?: string;
  assetId?: string;
  categoryId?: string;
  from?: string;
  to?: string;
}

export interface PaginatedTransactionResponse {
  items: TransactionResponse[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GroupedTransaction {
  dateStr: string;
  items: TransactionResponse[];
}
