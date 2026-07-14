import { TransactionResponse } from "../../transactions/types/transaction.type";
import { formatDisplayDate } from "@/shared/lib/helpers/date.helper";
import { MONTHS } from "@/shared/lib/configs/date.config";

export const getAvailableYears = (transactions: TransactionResponse[]) => {
  const yearsSet = new Set<string>();
  transactions.forEach((tx) => {
    yearsSet.add(new Date(tx.transactionDate).getFullYear().toString());
  });
  return Array.from(yearsSet).sort((a, b) => b.localeCompare(a));
};

export const applyTypeFilter = (
  transactions: TransactionResponse[],
  filterType: string,
) => {
  if (filterType === "ALL") return transactions;
  return transactions.filter((tx) => tx.type === filterType);
};

export const handleSearchMode = (
  filteredItems: TransactionResponse[],
  availableYears: string[],
  selectedYear: string,
  searchKeyword?: string,
) => {
  const years = ["All time", ...availableYears];
  const effectiveYear = years.includes(selectedYear)
    ? selectedYear
    : "All time";

  let items = filteredItems;
  if (effectiveYear !== "All time") {
    items = items.filter(
      (tx) =>
        new Date(tx.transactionDate).getFullYear().toString() === effectiveYear,
    );
  }

  if (searchKeyword) {
    const lowerKeyword = searchKeyword.toLowerCase();
    items = items.filter(
      (tx) =>
        tx.note?.toLowerCase().includes(lowerKeyword) ||
        tx.category?.name?.toLowerCase().includes(lowerKeyword) ||
        tx.amount.toString().includes(lowerKeyword) ||
        tx.type.toLowerCase().includes(lowerKeyword) ||
        tx.toAsset?.name?.toLowerCase().includes(lowerKeyword),
    );
  }

  return {
    items,
    effectiveYear,
    effectiveMonth: "Select",
    availableMonths: [],
    years,
  };
};

export const handleDateMode = (
  filteredItems: TransactionResponse[],
  availableYears: string[],
  selectedYear: string,
  selectedMonth: string,
) => {
  const effectiveYear = availableYears.includes(selectedYear)
    ? selectedYear
    : availableYears[0] || "Select";

  let items = filteredItems;
  if (effectiveYear !== "Select") {
    items = items.filter(
      (tx) =>
        new Date(tx.transactionDate).getFullYear().toString() === effectiveYear,
    );
  }

  const monthsSet = new Set<string>();
  items.forEach((tx) => {
    monthsSet.add(
      new Date(tx.transactionDate).toLocaleString("en-US", { month: "long" }),
    );
  });
  const availableMonths = Array.from(monthsSet).sort(
    (a, b) =>
      MONTHS.indexOf(b as (typeof MONTHS)[number]) -
      MONTHS.indexOf(a as (typeof MONTHS)[number]),
  );

  const effectiveMonth = availableMonths.includes(selectedMonth)
    ? selectedMonth
    : availableMonths[0] || "Select";

  if (effectiveMonth !== "Select") {
    items = items.filter(
      (tx) =>
        new Date(tx.transactionDate).toLocaleString("en-US", {
          month: "long",
        }) === effectiveMonth,
    );
  }

  return {
    items,
    effectiveYear,
    effectiveMonth,
    availableMonths,
    years: availableYears,
  };
};

export const groupTransactionsByDate = (
  transactions: TransactionResponse[],
) => {
  const groupsMap = new Map<string, typeof transactions>();

  transactions.forEach((tx) => {
    const txDate = new Date(tx.transactionDate);
    const dateStr = formatDisplayDate(txDate);

    if (!groupsMap.has(dateStr)) {
      groupsMap.set(dateStr, []);
    }
    groupsMap.get(dateStr)!.push(tx);
  });

  return Array.from(groupsMap.entries()).map(([dateStr, items]) => ({
    dateStr,
    items,
  }));
};
