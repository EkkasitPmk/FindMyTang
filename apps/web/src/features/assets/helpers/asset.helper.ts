import { TransactionResponse } from "../../transactions/types/transaction.type";
import { formatDisplayDate } from "@/shared/lib/helpers/date.helper";
import { Asset } from "../types/assets.type";

interface ProcessTransactionsParams {
  transactions: TransactionResponse[] | undefined;
  selectedYear: string;
  selectedMonth: string;
}

export const processAssetTransactions = ({
  transactions,
  selectedYear,
  selectedMonth,
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

  // 1. Get all available years
  const yearsSet = new Set<string>();
  transactions.forEach((tx) => {
    yearsSet.add(new Date(tx.transactionDate).getFullYear().toString());
  });
  const availableYears = Array.from(yearsSet).sort((a, b) =>
    b.localeCompare(a),
  );

  // Determine effective year to filter by
  const effectiveYear = availableYears.includes(selectedYear)
    ? selectedYear
    : availableYears[0];

  // 2. Filter transactions by effective year
  let filteredItems = transactions.filter(
    (tx) =>
      new Date(tx.transactionDate).getFullYear().toString() === effectiveYear,
  );

  // 3. Get all available months for the effective year
  const monthsSet = new Set<string>();
  filteredItems.forEach((tx) => {
    monthsSet.add(
      new Date(tx.transactionDate).toLocaleString("en-US", {
        month: "long",
      }),
    );
  });

  // Sort months descending (latest month to earliest month)
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const availableMonths = Array.from(monthsSet).sort(
    (a, b) => monthNames.indexOf(b) - monthNames.indexOf(a),
  );

  // Determine effective month
  const effectiveMonth = availableMonths.includes(selectedMonth)
    ? selectedMonth
    : availableMonths[0] || "Select";

  // 4. Filter transactions by effective month
  if (effectiveMonth !== "Select") {
    filteredItems = filteredItems.filter(
      (tx) =>
        new Date(tx.transactionDate).toLocaleString("en-US", {
          month: "long",
        }) === effectiveMonth,
    );
  }

  const groupedTransactions = (() => {
    const groups: { dateStr: string; items: typeof filteredItems }[] = [];
    let currentGroup: {
      dateStr: string;
      items: typeof filteredItems;
    } | null = null;

    filteredItems.forEach((tx) => {
      const txDate = new Date(tx.transactionDate);
      const dateStr = formatDisplayDate(txDate);

      if (currentGroup?.dateStr !== dateStr) {
        currentGroup = { dateStr, items: [] };
        groups.push(currentGroup);
      }
      currentGroup.items.push(tx);
    });
    return groups;
  })();

  return {
    months: availableMonths,
    years: availableYears,
    effectiveYear,
    effectiveMonth,
    groupedTransactions,
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
  let titleClass = "text-gray-800";
  if (isDeleted) titleClass = "text-gray-400 line-through";
  else if (isArchived) titleClass = "text-gray-400";

  let rowBgClass = "hover:bg-gray-50";
  if (isExpanded) rowBgClass = "bg-gray-50";
  else if (isEditingList) rowBgClass = isSelected ? "bg-primary/10" : "";

  const iconBgClass =
    hasColor && !isInactive
      ? "p-2.5 rounded-full"
      : "bg-gray-100 p-2.5 rounded-full";

  const containerBase =
    "rounded-lg border-l-4 overflow-hidden transition-all duration-200";
  const containerState = isInactive
    ? "bg-gray-50 opacity-60 border-l-gray-300"
    : "bg-white";
  const containerDrag = draggable ? "cursor-grab active:cursor-grabbing" : "";

  const headerBase =
    "w-full flex items-center justify-between px-3 py-2.5 transition-colors";
  const headerState = isEditingList ? "cursor-default" : "cursor-pointer";

  const balanceClass = isInactive ? "text-gray-400" : "text-gray-900";

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
