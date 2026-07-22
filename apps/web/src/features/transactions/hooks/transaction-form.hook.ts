import { useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";
import { CreateTransactionFormValues } from "../schemas/transaction.form.schema";
import {
  TransactionResponse,
  TransactionType,
} from "@/shared/lib/types/transaction.type";

interface UseTransactionFormSyncParams {
  transactionType: TransactionType;
  activeCategoryId: string | null;
  watchCategoryId: string | undefined;
  activeAssetId: string | null;
  watchAssetId: string | undefined;
  activeAssetToId: string | null;
  watchToAssetId: string | undefined;
  setValue: UseFormSetValue<CreateTransactionFormValues>;
}

export const useTransactionFormSync = ({
  transactionType,
  activeCategoryId,
  watchCategoryId,
  activeAssetId,
  watchAssetId,
  activeAssetToId,
  watchToAssetId,
  setValue,
}: UseTransactionFormSyncParams) => {
  useEffect(() => {
    const isCategoryType =
      transactionType === "EXPENSE" || transactionType === "INCOME";
    if (
      activeCategoryId &&
      activeCategoryId !== watchCategoryId &&
      isCategoryType
    ) {
      setValue("categoryId", activeCategoryId, { shouldValidate: true });
    }
  }, [activeCategoryId, watchCategoryId, setValue, transactionType]);

  useEffect(() => {
    if (activeAssetId && activeAssetId !== watchAssetId) {
      setValue("assetId", activeAssetId, { shouldValidate: true });
    }
  }, [activeAssetId, watchAssetId, setValue]);

  useEffect(() => {
    if (
      activeAssetToId &&
      activeAssetToId !== watchToAssetId &&
      transactionType === "TRANSFER"
    ) {
      setValue("toAssetId", activeAssetToId, { shouldValidate: true });
    }
  }, [activeAssetToId, watchToAssetId, setValue, transactionType]);
};

interface UseTransactionInitializationParams {
  existingTx: TransactionResponse | undefined;
  prevTxId: string | null;
  setPrevTxId: (id: string | null) => void;
  setTransactionType: (type: TransactionType) => void;
  setAmountDigits: (digits: string) => void;
  setDisplayMonth: (date: Date) => void;
  setRemovedAttachment: (removed: boolean) => void;
  setFile: (file: File | null) => void;
  setIsMoreDetailsOpen: (open: boolean) => void;
  typeParam: string | null;
  prevTypeParam: string | null;
  setPrevTypeParam: (param: string | null) => void;
  resolveDefaultTransactionType: (
    existingTx: TransactionResponse | undefined,
    typeParam: string | null,
  ) => TransactionType;
  convertAmountToDigits: (amount: number) => string;
}

export const useTransactionInitialization = ({
  existingTx,
  prevTxId,
  setPrevTxId,
  setTransactionType,
  setAmountDigits,
  setDisplayMonth,
  setRemovedAttachment,
  typeParam,
  prevTypeParam,
  setPrevTypeParam,
  resolveDefaultTransactionType,
  convertAmountToDigits,
  setFile,
}: UseTransactionInitializationParams) => {
  if (existingTx && existingTx.id !== prevTxId) {
    setPrevTxId(existingTx.id);
    setTransactionType(existingTx.type);
    setAmountDigits(convertAmountToDigits(existingTx.amount));
    setDisplayMonth(new Date(existingTx.transactionDate));
    setRemovedAttachment(false);
  } else if (!existingTx && prevTxId !== null) {
    setPrevTxId(null);
    setAmountDigits("");
    setRemovedAttachment(false);
    setFile(null);
    setTransactionType(resolveDefaultTransactionType(undefined, typeParam));
    setPrevTypeParam(typeParam);
  } else if (!existingTx && typeParam !== prevTypeParam) {
    setPrevTypeParam(typeParam);
    setTransactionType(resolveDefaultTransactionType(undefined, typeParam));
  }
};
