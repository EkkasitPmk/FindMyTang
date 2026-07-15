import { TransactionResponse } from "../../transactions/types/transaction.type";
import { Asset } from "../types/assets.type";
import {
  getAvailableYears,
  applyTypeFilter,
  handleSearchMode,
  handleDateMode,
  groupTransactionsByDate,
} from "./asset-transactions.helper";

interface ProcessTransactionsParams {
  transactions: TransactionResponse[] | undefined;
  selectedYear: string;
  selectedMonth: string;
  searchKeyword?: string;
  isSearchMode?: boolean;
  filterType?: "ALL" | "INCOME" | "EXPENSE" | "TRANSFER" | "ADJUSTMENT";
}

export const processAssetTransactions = ({
  transactions,
  selectedYear,
  selectedMonth,
  searchKeyword,
  isSearchMode,
  filterType = "ALL",
}: ProcessTransactionsParams) => {
  if (!transactions?.length) {
    return {
      months: [] as string[],
      years: [] as string[],
      effectiveYear: "Select",
      effectiveMonth: "Select",
      groupedTransactions: [],
      filteredItems: [],
    };
  }

  const availableYears = getAvailableYears(transactions);
  let filteredItems = applyTypeFilter(transactions, filterType);

  const modeResult = isSearchMode
    ? handleSearchMode(
        filteredItems,
        availableYears,
        selectedYear,
        searchKeyword,
      )
    : handleDateMode(
        filteredItems,
        availableYears,
        selectedYear,
        selectedMonth,
      );

  filteredItems = modeResult.items;

  return {
    months: modeResult.availableMonths,
    years: modeResult.years,
    effectiveYear: modeResult.effectiveYear,
    effectiveMonth: modeResult.effectiveMonth,
    groupedTransactions: groupTransactionsByDate(filteredItems),
    filteredItems,
  };
};

export const reorderList = (
  list: Asset[],
  startIndex: number,
  endIndex: number,
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const getManageAssetItemClasses = ({
  isDeleted,
  isArchived,
  isInactive,
  isExpanded,
  isEditingList,
  isSelected,
  draggable,
  hasColor,
}: {
  isDeleted: boolean;
  isArchived: boolean;
  isInactive: boolean;
  isExpanded: boolean;
  isEditingList: boolean;
  isSelected: boolean;
  draggable: boolean;
  hasColor: boolean;
}) => {
  let titleClass = "text-primary-text";
  if (isDeleted) titleClass = "text-disabled-text line-through";
  else if (isArchived) titleClass = "text-disabled-text";

  let rowBgClass = "hover:bg-surface-secondary";
  if (isExpanded) rowBgClass = "bg-surface-secondary";
  else if (isEditingList) rowBgClass = isSelected ? "bg-primary/10" : "";

  const iconBgClass =
    hasColor && !isInactive
      ? "p-2.5 rounded-full"
      : "bg-surface-secondary p-2.5 rounded-full";

  const containerBase =
    "rounded-lg border-l-4 overflow-hidden transition-all duration-200";
  const containerState = isInactive
    ? "bg-surface-secondary opacity-60 border-l-border"
    : "bg-surface";
  const containerDrag = draggable ? "cursor-grab active:cursor-grabbing" : "";

  const headerBase =
    "w-full flex items-center justify-between px-3 py-2.5 transition-colors";
  const headerState = isEditingList ? "cursor-default" : "cursor-pointer";

  const balanceClass = isInactive ? "text-disabled-text" : "text-primary-text";

  return {
    titleClass,
    rowBgClass,
    iconBgClass,
    containerClasses: [containerBase, containerState, containerDrag]
      .filter(Boolean)
      .join(" "),
    headerClasses: [headerBase, headerState, rowBgClass]
      .filter(Boolean)
      .join(" "),
    balanceClass: `font-semibold text-base ${balanceClass}`,
  };
};
