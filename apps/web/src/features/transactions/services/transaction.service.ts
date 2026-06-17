import http from "@/shared/lib/api/http";
import {
  CreateExpenseRequest,
  CreateIncomeRequest,
  TransactionResponse,
  TransactionQuery,
  PaginatedTransactionResponse,
} from "../types/transaction.type";

export const createExpenseApi = async (
  data: CreateExpenseRequest,
): Promise<TransactionResponse> => {
  const response = await http.post<TransactionResponse>(
    "/transactions/expense",
    data,
  );
  return response.data;
};

export const createIncomeApi = async (
  data: CreateIncomeRequest,
): Promise<TransactionResponse> => {
  const response = await http.post<TransactionResponse>(
    "/transactions/income",
    data,
  );
  return response.data;
};

export const getTransactionsApi = async (
  params?: TransactionQuery,
): Promise<PaginatedTransactionResponse> => {
  const response = await http.get<PaginatedTransactionResponse>(
    "/transactions",
    { params },
  );
  return response.data;
};
