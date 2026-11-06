import { TransactionType } from "@/shared/lib/types/transaction.type";

export type AssetFilterType = "ALL" | TransactionType;

export type AssetSortType =
  | "DATE_NEWEST"
  | "DATE_OLDEST"
  | "AMOUNT_HIGHEST"
  | "AMOUNT_LOWEST";

export interface AssetMonthlySummary {
  income: number;
  expense: number;
  transfer: number;
  adjustment: number;
  net: number;
  incomeCount: number;
  expenseCount: number;
  transferCount: number;
  adjustmentCount: number;
}
