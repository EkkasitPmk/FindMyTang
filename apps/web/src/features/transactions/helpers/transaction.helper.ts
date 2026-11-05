import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CreateTransactionFormValues } from "../schemas/transaction.form.schema";
import {
  TransactionResponse,
  TransactionType,
  UpdateTransactionRequest,
  CreateTransactionPayload,
} from "@/shared/lib/types/transaction.type";
import { ApiErrorResponse } from "@/shared/lib/types/api.type";
import { TranslationKey } from "@/shared/lib/configs/translations.config";
import { ModalState } from "@/shared/lib/hooks/useModalState.hook";

const TRANSACTION_TYPE_LABEL_KEYS: Record<string, string> = {
  expense: "expense",
  income: "income",
  transfer: "transfer",
  adjustment: "adjustment",
};

export function getTypeLabel(
  type: string,
  t: (key: TranslationKey) => string,
): string {
  const lower = type.toLowerCase();
  const key = TRANSACTION_TYPE_LABEL_KEYS[lower];
  return key ? t(key as TranslationKey) : lower;
}

export function parseErrorMessage(
  err: AxiosError<ApiErrorResponse>,
  fallback: string,
): string {
  const msg = err.response?.data?.message;
  if (Array.isArray(msg)) {
    return msg[0];
  }
  return msg || fallback;
}

export function checkIsLoading(
  isPending: boolean,
  isFetching: boolean,
): boolean {
  return isPending || isFetching;
}

export function checkIsTxLoading(
  editId: string | null,
  isPending: boolean,
): boolean {
  return Boolean(editId) && isPending;
}

export function checkIsSubmitting(
  createPending: boolean,
  updatePending: boolean,
  deletePending: boolean,
): boolean {
  return createPending || updatePending || deletePending;
}

export function isCategoryType(type: TransactionType): boolean {
  return type === "EXPENSE" || type === "INCOME";
}

export function getLoadingModalProps(
  modalState: ModalState,
  isSubmitting: boolean,
) {
  return {
    isOpen: modalState.isOpen || isSubmitting,
    status: modalState.isOpen ? modalState.status : "loading",
    message: modalState.isOpen ? modalState.message : undefined,
  };
}

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
  t: (key: TranslationKey) => string;
}

function resolveSubmitCategoryId(
  type: TransactionType,
  isExternal: boolean,
  categoryId?: string,
): string | undefined {
  if (type !== "TRANSFER") return categoryId;

  return isExternal ? categoryId || undefined : undefined;
}

function validateSubmission(
  type: TransactionType,
  isExternal: boolean,
  data: CreateTransactionFormValues,
  toast: { error: (msg: string) => void },
  t: (key: TranslationKey) => string,
): boolean {
  if (type === "TRANSFER" && !isExternal && !data.toAssetId) {
    toast.error(t("errSelectTargetAsset"));
    return false;
  }
  if (isCategoryType(type) && !data.categoryId) {
    toast.error(t("errSelectCategory"));
    return false;
  }
  return true;
}

function buildUpdatePayload(
  type: TransactionType,
  finalData: CreateTransactionFormValues,
  isExternalTransfer: boolean,
  removedAttachment?: boolean,
): UpdateTransactionRequest {
  return {
    type,
    assetId: finalData.assetId,
    amount: finalData.amount,
    note: finalData.note,
    transactionDate: finalData.transactionDate,
    toAssetId: isExternalTransfer ? null : finalData.toAssetId,
    categoryId: finalData.categoryId || null,
    attachmentUrl: removedAttachment ? null : undefined,
    file: finalData.file || null,
  };
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
  t,
}: SubmitTransactionParams) => {
  const isExternalTransfer =
    transactionType === "TRANSFER" && data.toAssetId === "EXTERNAL";

  const categoryId = resolveSubmitCategoryId(
    transactionType,
    isExternalTransfer,
    data.categoryId,
  );

  const finalData: CreateTransactionFormValues = {
    ...data,
    toAssetId: isExternalTransfer ? undefined : data.toAssetId,
    categoryId,
    file: file || undefined,
  };

  if (
    !validateSubmission(
      transactionType,
      isExternalTransfer,
      finalData,
      toast,
      t,
    )
  ) {
    return;
  }

  if (editId) {
    updateTransaction.mutate({
      id: editId,
      data: buildUpdatePayload(
        transactionType,
        finalData,
        isExternalTransfer,
        removedAttachment,
      ),
    });
    return;
  }

  createTransaction.mutate({
    type: transactionType,
    data: finalData as unknown as CreateTransactionPayload,
  });
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
  toAssetId:
    existingTx?.type === "TRANSFER" && !existingTx?.toAssetId
      ? "EXTERNAL"
      : existingTx?.toAssetId || "",
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
  t: (key: TranslationKey) => string = (k) => k,
) => {
  if (editId) {
    if (existingType === "TRANSFER") {
      return [{ label: t("transfer"), value: "TRANSFER" }];
    }
    if (existingType === "ADJUSTMENT") {
      return [{ label: t("adjustment"), value: "ADJUSTMENT" }];
    }
    if (existingType === "EXPENSE" || existingType === "INCOME") {
      return [
        { label: t("expense"), value: "EXPENSE" },
        { label: t("income"), value: "INCOME" },
      ];
    }
  }
  return [
    { label: t("expense"), value: "EXPENSE" },
    { label: t("income"), value: "INCOME" },
    { label: t("transfer"), value: "TRANSFER" },
    { label: t("adjustment"), value: "ADJUSTMENT" },
  ];
};
