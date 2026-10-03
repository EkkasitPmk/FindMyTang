import { MONTHS } from "@/shared/lib/configs/date.config";
import { TransactionResponse } from "@/shared/lib/types/transaction.type";

export function getTransactionDateRange(
  isSearchMode: boolean,
  effectiveYear: string,
  effectiveMonth: string,
) {
  if (isSearchMode) {
    if (effectiveYear === "All time") return { from: undefined, to: undefined };

    return {
      from: new Date(Number(effectiveYear), 0, 1).toISOString(),
      to: new Date(Number(effectiveYear), 11, 31, 23, 59, 59).toISOString(),
    };
  }

  if (effectiveYear === "Select") return { from: undefined, to: undefined };

  const year = Number(effectiveYear);
  if (effectiveMonth === "Select") {
    return {
      from: new Date(year, 0, 1).toISOString(),
      to: new Date(year, 11, 31, 23, 59, 59).toISOString(),
    };
  }

  const monthIndex = MONTHS.indexOf(effectiveMonth as (typeof MONTHS)[number]);
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  return {
    from: new Date(year, monthIndex, 1).toISOString(),
    to: new Date(year, monthIndex, lastDay, 23, 59, 59).toISOString(),
  };
}

export function shouldShowAssetLoading(
  isAssetsPending: boolean,
  isGuest: boolean,
  hasInitialAssets: boolean,
  includeDeleted: boolean,
  initialIncludeDeleted: boolean | undefined,
) {
  return (
    isAssetsPending &&
    (isGuest || !hasInitialAssets || includeDeleted !== initialIncludeDeleted)
  );
}

export function shouldFetchTransactions(
  isSearchMode: boolean,
  debouncedSearchKeyword: string,
  hasAvailableDates: boolean,
) {
  return (
    (!isSearchMode || Boolean(debouncedSearchKeyword)) && hasAvailableDates
  );
}

export function shouldShowTransactionsLoading(
  isSearchMode: boolean,
  isAvailableDatesPending: boolean,
  isTransactionsFetching: boolean,
  isFetchingNextPage: boolean,
  isTransactionsPending: boolean,
) {
  return (
    (!isSearchMode && isAvailableDatesPending) ||
    (isTransactionsFetching &&
      !isFetchingNextPage &&
      (isTransactionsPending || isSearchMode))
  );
}

export function getEffectiveYear(
  selectedYear: string,
  availableYears: string[],
  isSearchMode: boolean,
  currentYearStr: string,
) {
  if (isSearchMode) {
    return ["All time", ...availableYears].includes(selectedYear)
      ? selectedYear
      : "All time";
  }
  if (availableYears.length === 0) return currentYearStr;
  return availableYears.includes(selectedYear)
    ? selectedYear
    : availableYears[0] || currentYearStr;
}

export function getAvailableMonths(
  isSearchMode: boolean,
  effectiveYear: string,
  availableDatesData: Record<string, string[]> | undefined,
  availableYearsLength: number,
  currentMonthStr: string,
) {
  if (
    isSearchMode ||
    effectiveYear === "Select" ||
    effectiveYear === "All time"
  ) {
    return [];
  }
  const monthsForYear = availableDatesData?.[effectiveYear] || [];
  if (monthsForYear.length === 0 && availableYearsLength === 0) {
    return [currentMonthStr];
  }
  return [...monthsForYear].sort(
    (a, b) =>
      MONTHS.indexOf(b as (typeof MONTHS)[number]) -
      MONTHS.indexOf(a as (typeof MONTHS)[number]),
  );
}

export function getEffectiveMonth(
  selectedMonth: string,
  availableMonths: string[],
  isSearchMode: boolean,
  currentMonthStr: string,
) {
  if (isSearchMode) return "Select";
  if (availableMonths.length === 0) return currentMonthStr;
  return availableMonths.includes(selectedMonth)
    ? selectedMonth
    : availableMonths[0] || currentMonthStr;
}

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

export function calculateAssetMonthlySummary(
  items: TransactionResponse[],
): AssetMonthlySummary {
  let income = 0;
  let expense = 0;
  let transfer = 0;
  let adjustment = 0;
  let incomeCount = 0;
  let expenseCount = 0;
  let transferCount = 0;
  let adjustmentCount = 0;

  for (const tx of items) {
    switch (tx.type) {
      case "INCOME":
        income += tx.amount;
        incomeCount++;
        break;
      case "EXPENSE":
        expense += tx.amount;
        expenseCount++;
        break;
      case "TRANSFER":
        transfer += tx.amount;
        transferCount++;
        break;
      case "ADJUSTMENT":
        adjustment += tx.amount;
        adjustmentCount++;
        break;
    }
  }

  return {
    income,
    expense,
    transfer,
    adjustment,
    net: income - expense,
    incomeCount,
    expenseCount,
    transferCount,
    adjustmentCount,
  };
}
