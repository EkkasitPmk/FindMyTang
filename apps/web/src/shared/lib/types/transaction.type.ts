import {
  TransactionResponse as ZodTransactionResponse,
  PaginatedTransactionResponse as ZodPaginatedTransactionResponse,
} from "@/features/transactions/schemas/transaction.response.schema";

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
export type CreateTransactionPayload =
  | CreateExpenseRequest
  | CreateIncomeRequest
  | CreateTransferRequest
  | CreateAdjustmentRequest;

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
  deletedAt?: string | null;
}

export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER" | "ADJUSTMENT";

export type TransactionResponse = ZodTransactionResponse;

export interface TransactionQuery {
  page?: number;
  limit?: number;
  pagination?: "page" | "cursor";
  cursor?: string;
  cursorDirection?: "next" | "previous";
  type?: string;
  assetId?: string;
  categoryId?: string;
  from?: string;
  to?: string;
  isDeleted?: boolean;
  sortType?: string;
  searchKeyword?: string;
}

export type PaginatedTransactionResponse = ZodPaginatedTransactionResponse;

export interface GroupedTransaction {
  dateStr: string;
  items: TransactionResponse[];
}
