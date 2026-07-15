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
  const payload: Record<string, unknown> = {
    type,
    assetId: data.assetId,
    amount: data.amount,
    date: data.transactionDate,
  };

  if (data.note) payload.note = data.note;
  if ("categoryId" in data && data.categoryId)
    payload.categoryId = data.categoryId;
  if ("toAssetId" in data && data.toAssetId) payload.toAssetId = data.toAssetId;

  if (data.file) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    // Force Safari to load the file into memory to avoid DOM detachment bugs
    const arrayBuffer = await data.file.arrayBuffer();
    const safeBlob = new Blob([arrayBuffer], { type: data.file.type });
    formData.append("file", safeBlob, data.file.name);

    const response = await http.post<TransactionResponse>(
      "/transactions",
      formData,
    );

    return response.data;
  }

  const response = await http.post<TransactionResponse>(
    "/transactions",
    payload,
  );
  return response.data;
};

export const getTransactionsApi = async (query?: TransactionQuery) => {
  const { data } = await http.get<PaginatedTransactionResponse>(
    "/transactions",
    { params: query },
  );
  return data;
};

export const getAvailableDatesApi = async (assetId?: string) => {
  const { data } = await http.get<Record<string, string[]>>(
    "/transactions/available-dates",
    {
      params: { assetId },
    },
  );
  return data;
};

export const getTransactionApi = async (id: string) => {
  const { data } = await http.get<TransactionResponse>(`/transactions/${id}`);
  return data;
};

export const getTransactionYearsApi = async (): Promise<number[]> => {
  const response = await http.get<number[]>("/transactions/years");
  return response.data;
};

export const updateTransactionApi = async (
  id: string,
  data: UpdateTransactionRequest,
): Promise<TransactionResponse> => {
  const payload: Record<string, unknown> = {
    type: data.type,
    assetId: data.assetId,
    amount: data.amount,
    date: data.transactionDate,
  };

  if (data.note) payload.note = data.note;
  if (data.toAssetId) payload.toAssetId = data.toAssetId;
  if (data.categoryId) payload.categoryId = data.categoryId;
  if (data.attachmentUrl === null) payload.attachmentUrl = "";
  if (data.deletedAt === null) payload.deletedAt = "null";
  else if (data.deletedAt) payload.deletedAt = data.deletedAt;

  if (data.file) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    // Force Safari to load the file into memory to avoid DOM detachment bugs
    const arrayBuffer = await data.file.arrayBuffer();
    const safeBlob = new Blob([arrayBuffer], { type: data.file.type });
    formData.append("file", safeBlob, data.file.name);

    const response = await http.patch<TransactionResponse>(
      `/transactions/${id}`,
      formData,
    );

    return response.data;
  }

  const response = await http.patch<TransactionResponse>(
    `/transactions/${id}`,
    payload,
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
