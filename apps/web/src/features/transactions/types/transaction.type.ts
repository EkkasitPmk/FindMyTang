export interface CreateExpenseRequest {
  assetId: string;
  categoryId: string;
  amount: number;
  note?: string;
  transactionDate: string;
}

export interface CreateIncomeRequest {
  assetId: string;
  categoryId: string;
  amount: number;
  note?: string;
  transactionDate: string;
}

export interface TransactionResponse {
  id: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  amount: number;
  note?: string;
  transactionDate: string;
  assetId: string;
  categoryId?: string;
  asset?: {
    id: string;
    name: string;
    type: string;
    balance: number;
  };
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
