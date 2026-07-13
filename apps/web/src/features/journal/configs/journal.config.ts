export type JournalTransactionType =
  "all" | "income" | "expense" | "transfer" | "adjustment";

export const JOURNAL_TRANSACTION_TYPES: {
  label: string;
  value: JournalTransactionType;
}[] = [
  { label: "All", value: "all" },
  { label: "Income", value: "income" },
  { label: "Expense", value: "expense" },
  { label: "Transfer", value: "transfer" },
  { label: "Adjustment", value: "adjustment" },
];
