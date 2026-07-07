import http from "@/shared/lib/api/http";
import {
  CreateExpenseRequest,
  CreateIncomeRequest,
  CreateTransferRequest,
  CreateAdjustmentRequest,
  TransactionResponse,
  TransactionQuery,
  PaginatedTransactionResponse,
  UpdateTransactionRequest,
  TransactionType,
} from "../types/transaction.type";

export const createTransactionApi = async (
  data:
    | CreateExpenseRequest
    | CreateIncomeRequest
    | CreateTransferRequest
    | CreateAdjustmentRequest,
  type: TransactionType,
): Promise<TransactionResponse> => {
  const formData = new FormData();
  formData.append("type", type);
  formData.append("assetId", data.assetId);
  formData.append("amount", data.amount.toString());
  if (data.note) formData.append("note", data.note);
  formData.append("date", data.transactionDate);

  if ("categoryId" in data && data.categoryId) {
    formData.append("categoryId", data.categoryId);
  }
  if ("toAssetId" in data && data.toAssetId) {
    formData.append("toAssetId", data.toAssetId);
  }
  if (data.file) {
    formData.append("file", data.file);
  }

  const response = await http.post<TransactionResponse>(
    "/transactions",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
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

export const updateTransactionApi = async (
  id: string,
  data: UpdateTransactionRequest,
): Promise<TransactionResponse> => {
  const formData = new FormData();
  formData.append("type", data.type);
  formData.append("assetId", data.assetId);
  formData.append("amount", data.amount.toString());
  if (data.note) formData.append("note", data.note);
  formData.append("date", data.transactionDate);
  if (data.toAssetId) formData.append("toAssetId", data.toAssetId);
  if (data.categoryId) formData.append("categoryId", data.categoryId);
  if (data.attachmentUrl === null) formData.append("attachmentUrl", "");
  if (data.file) formData.append("file", data.file);
  if (data.deletedAt === null) formData.append("deletedAt", "null");
  else if (data.deletedAt) formData.append("deletedAt", data.deletedAt);

  const response = await http.patch<TransactionResponse>(
    `/transactions/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const deleteTransactionApi = async (
  id: string,
  isHardDelete?: boolean,
): Promise<void> => {
  await http.delete(`/transactions/${id}`, {
    params: { hardDelete: isHardDelete },
  });
};
