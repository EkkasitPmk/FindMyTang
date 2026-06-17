import http from "@/shared/lib/api/http";
import {
  CreateExpenseRequest,
  TransactionResponse,
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
