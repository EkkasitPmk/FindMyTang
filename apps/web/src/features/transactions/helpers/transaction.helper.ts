import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CreateTransactionFormValues } from "../schemas/transaction.schema";
import { Asset } from "@/features/assets/types/assets.type";
import {
  TransactionResponse,
  TransactionType,
  CreateExpenseRequest,
  CreateIncomeRequest,
  CreateTransferRequest,
  CreateAdjustmentRequest,
  UpdateTransactionRequest,
} from "../types/transaction.type";
import { ApiErrorResponse } from "../hooks/transaction.hook";

interface SubmitTransactionParams {
  transactionType: TransactionType;
  data: CreateTransactionFormValues;
  file?: File | null;
  assets?: Asset[];
  createExpense: UseMutationResult<
    TransactionResponse,
    AxiosError<ApiErrorResponse>,
    CreateExpenseRequest
  >;
  createIncome: UseMutationResult<
    TransactionResponse,
    AxiosError<ApiErrorResponse>,
    CreateIncomeRequest
  >;
  createTransfer: UseMutationResult<
    TransactionResponse,
    AxiosError<ApiErrorResponse>,
    CreateTransferRequest
  >;
  createAdjustment: UseMutationResult<
    TransactionResponse,
    AxiosError<ApiErrorResponse>,
    CreateAdjustmentRequest
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
  assets,
  createExpense,
  createIncome,
  createTransfer,
  createAdjustment,
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

  let finalAmount = finalData.amount;
  if (transactionType === "ADJUSTMENT") {
    const selectedAsset = assets?.find((a) => a.id === finalData.assetId);
    finalAmount = finalData.amount - (selectedAsset?.balance || 0);
  }

  if (editId) {
    updateTransaction.mutate({
      id: editId,
      data: {
        type: transactionType,
        assetId: finalData.assetId,
        amount: finalAmount,
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

  if (transactionType === "TRANSFER") {
    createTransfer.mutate({ ...finalData, toAssetId: finalData.toAssetId! });
  } else if (transactionType === "EXPENSE") {
    createExpense.mutate({ ...finalData, categoryId: finalData.categoryId! });
  } else if (transactionType === "INCOME") {
    createIncome.mutate({ ...finalData, categoryId: finalData.categoryId! });
  } else if (transactionType === "ADJUSTMENT") {
    createAdjustment.mutate({ ...finalData, amount: finalAmount });
  }
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
  transactionDate: existingTx
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

export const parseAmountDigits = (value: string): string => {
  let digits = value.replace(/\D/g, "");
  digits = digits.replace(/^0+/, "");
  if (digits.length > 10) {
    digits = digits.slice(0, 10);
  }
  return digits;
};

export const convertDigitsToAmount = (digits: string): number => {
  if (digits.length === 0) return 0;
  const padded = digits.padStart(3, "0");
  const integerPart = padded.slice(0, -2);
  const decimalPart = padded.slice(-2);
  return Number(`${integerPart}.${decimalPart}`);
};

export const convertAmountToDigits = (amount: number): string => {
  return Math.round(Math.abs(amount) * 100).toString();
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
