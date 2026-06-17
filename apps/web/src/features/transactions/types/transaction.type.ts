export interface CreateExpenseRequest {
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
  date: string;
  assetId: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
}
