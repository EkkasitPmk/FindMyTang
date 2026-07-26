import { formatDisplayDate } from "@/shared/lib/helpers/date.helper";
import { TransactionResponse } from "@/shared/lib/types/transaction.type";
import { TranslationKey } from "@/shared/lib/configs/translations.config";

export function getTransferDetails(
  transaction: TransactionResponse,
  currentAssetId?: string,
) {
  let isTransferIn = false;
  let isTransferOut = false;

  if (transaction.type === "TRANSFER" && currentAssetId) {
    if (transaction.toAssetId === currentAssetId) {
      isTransferIn = true;
    } else if (transaction.assetId === currentAssetId) {
      isTransferOut = true;
    }
  }
  return { isTransferIn, isTransferOut };
}

export function getAmountDisplayConfig(
  type: string,
  isTransferIn: boolean,
  isTransferOut: boolean,
  amount: number = 0,
) {
  const isIncome = type === "INCOME";
  const isExpense = type === "EXPENSE";
  const isAdjustment = type === "ADJUSTMENT";
  const isTransfer = type === "TRANSFER";

  let amountColorClass = "text-primary-text";
  let amountPrefix = "";

  if (isIncome || isTransferIn || (isAdjustment && amount >= 0)) {
    amountColorClass = "text-income";
    amountPrefix = "+";
  } else if (
    isExpense ||
    isTransferOut ||
    (isAdjustment && amount < 0) ||
    (isTransfer && !isTransferIn && !isTransferOut)
  ) {
    amountColorClass = "text-expense";
    amountPrefix = "-";
  }

  return { amountColorClass, amountPrefix, isIncome, isExpense };
}

export function getDisplayTitle(transaction: TransactionResponse) {
  if (transaction.type === "ADJUSTMENT" || transaction.type === "TRANSFER") {
    return transaction.type.toLowerCase();
  }
  return transaction.category?.name || transaction.note || transaction.type;
}

export function getTimeDisplay(
  transactionDate: string,
  locale?: string,
  t?: (key: TranslationKey) => string,
) {
  const txDate = new Date(transactionDate);
  const dateString = String(transactionDate);
  const isNoTime =
    dateString.includes("T00:00:00") ||
    (txDate.getHours() === 0 &&
      txDate.getMinutes() === 0 &&
      txDate.getSeconds() === 0);

  return formatDisplayDate(txDate, !isNoTime, locale, t);
}

export function getTimeOnly(transactionDate: string) {
  const txDate = new Date(transactionDate);
  const dateString = String(transactionDate);
  const isNoTime =
    dateString.includes("T00:00:00") ||
    (txDate.getHours() === 0 &&
      txDate.getMinutes() === 0 &&
      txDate.getSeconds() === 0);

  if (isNoTime) return null;

  return txDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
