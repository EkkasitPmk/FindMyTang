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
} from "../types/transaction.type";

export const createExpenseApi = async (
  data: CreateExpenseRequest,
): Promise<TransactionResponse> => {
  const formData = new FormData();
  formData.append("assetId", data.assetId);
  formData.append("categoryId", data.categoryId);
  formData.append("amount", data.amount.toString());
  if (data.note) formData.append("note", data.note);
  formData.append("transactionDate", data.transactionDate);
  if (data.file) formData.append("file", data.file);

  const response = await http.post<TransactionResponse>(
    "/transactions/expense",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const createIncomeApi = async (
  data: CreateIncomeRequest,
): Promise<TransactionResponse> => {
  const formData = new FormData();
  formData.append("assetId", data.assetId);
  formData.append("categoryId", data.categoryId);
  formData.append("amount", data.amount.toString());
  if (data.note) formData.append("note", data.note);
  formData.append("transactionDate", data.transactionDate);
  if (data.file) formData.append("file", data.file);

  const response = await http.post<TransactionResponse>(
    "/transactions/income",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const createTransferApi = async (
  data: CreateTransferRequest,
): Promise<TransactionResponse> => {
  const formData = new FormData();
  formData.append("assetId", data.assetId);
  formData.append("toAssetId", data.toAssetId);
  formData.append("amount", data.amount.toString());
  if (data.note) formData.append("note", data.note);
  formData.append("transactionDate", data.transactionDate);
  if (data.file) formData.append("file", data.file);

  const response = await http.post<TransactionResponse>(
    "/transactions/transfer",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const createAdjustmentApi = async (
  data: CreateAdjustmentRequest,
): Promise<TransactionResponse> => {
  const formData = new FormData();
  formData.append("assetId", data.assetId);
  formData.append("amount", data.amount.toString());
  if (data.note) formData.append("note", data.note);
  formData.append("transactionDate", data.transactionDate);
  if (data.file) formData.append("file", data.file);

  const response = await http.post<TransactionResponse>(
    "/transactions/adjustment",
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
