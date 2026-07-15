import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CreateTransactionFormValues } from "../schemas/transaction.schema";
import {
  TransactionResponse,
  TransactionType,
  UpdateTransactionRequest,
  CreateTransactionPayload,
} from "../types/transaction.type";
import { ApiErrorResponse } from "../hooks/transaction.hook";

interface SubmitTransactionParams {
  transactionType: TransactionType;
  data: CreateTransactionFormValues;
  file?: File | null;
  createTransaction: UseMutationResult<
    TransactionResponse,
    AxiosError<ApiErrorResponse>,
    {
      type: TransactionType;
      data: CreateTransactionPayload;
    }
  >;
  updateTransaction: UseMutationResult<
    TransactionResponse,
    AxiosError<ApiErrorResponse>,
    { id: string; data: UpdateTransactionRequest }
  >;
  editId?: string | null;
  removedAttachment?: boolean;
  toast: { error: (msg: string) => void };
}

export const submitTransaction = ({
  transactionType,
  data,
  file,
  createTransaction,
  updateTransaction,
  editId,
  removedAttachment,
  toast,
}: SubmitTransactionParams) => {
  const finalData = { ...data, file: file || undefined };

  if (transactionType === "TRANSFER" && !finalData.toAssetId) {
    toast.error("Please select a target asset");
    return;
  }

  if (
    (transactionType === "EXPENSE" || transactionType === "INCOME") &&
    !finalData.categoryId
  ) {
    toast.error("Please select a category");
    return;
  }

  if (editId) {
    updateTransaction.mutate({
      id: editId,
      data: {
        type: transactionType,
        assetId: finalData.assetId,
        amount: finalData.amount,
        note: finalData.note,
        transactionDate: finalData.transactionDate,
        toAssetId: finalData.toAssetId,
        categoryId: finalData.categoryId,
        attachmentUrl: removedAttachment ? null : undefined,
        file: finalData.file || null,
      },
    });
    return;
  }

  createTransaction.mutate({ type: transactionType, data: finalData });
};

export const resolveDefaultTransactionType = (
  existingTx?: TransactionResponse,
  typeParam?: string | null,
): TransactionType => {
  if (existingTx) return existingTx.type;

  const validTypes = ["INCOME", "EXPENSE", "TRANSFER", "ADJUSTMENT"];
  if (typeParam && validTypes.includes(typeParam)) {
    return typeParam as TransactionType;
  }

  return "EXPENSE";
};

export const createDefaultFormValues = (
  existingTx?: TransactionResponse,
  defaultAssetId?: string | null,
) => ({
  amount: existingTx?.amount || 0,
  note: existingTx?.note || "",
  transactionDate: existingTx?.transactionDate
    ? new Date(existingTx.transactionDate).toISOString()
    : new Date().toISOString(),
  assetId: existingTx?.assetId || defaultAssetId || "",
  categoryId: existingTx?.categoryId || "",
  toAssetId: existingTx?.toAssetId || "",
});

export const getActiveItemId = (
  watchId: string | undefined | null,
  items: Array<{ id: string }>,
  fallbackId: string | null = null,
): string | null => {
  if (watchId && items.some((item) => item.id === watchId)) {
    return watchId;
  }
  return items.length > 0 ? items[0].id : fallbackId;
};

export const getTransactionTypeOptions = (
  editId: string | null | undefined,
  existingType: TransactionType | undefined,
) => {
  if (editId) {
    if (existingType === "TRANSFER") {
      return [{ label: "Transfer", value: "TRANSFER" }];
    }
    if (existingType === "ADJUSTMENT") {
      return [{ label: "Adjustment", value: "ADJUSTMENT" }];
    }
    if (existingType === "EXPENSE" || existingType === "INCOME") {
      return [
        { label: "Expense", value: "EXPENSE" },
        { label: "Income", value: "INCOME" },
      ];
    }
  }
  return [
    { label: "Expense", value: "EXPENSE" },
    { label: "Income", value: "INCOME" },
    { label: "Transfer", value: "TRANSFER" },
    { label: "Adjustment", value: "ADJUSTMENT" },
  ];
};
