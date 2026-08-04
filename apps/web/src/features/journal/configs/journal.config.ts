export type JournalTransactionType =
  | "all"
  | "income"
  | "expense"
  | "transfer"
  | "adjustment"
  | "deleted";

export const JOURNAL_TRANSACTION_TYPES: {
  label: string;
  value: JournalTransactionType;
  activeColorClass: string;
}[] = [
  { label: "All", value: "all", activeColorClass: "bg-primary text-white" },
  {
    label: "Income",
    value: "income",
    activeColorClass: "bg-income text-white",
  },
  {
    label: "Expense",
    value: "expense",
    activeColorClass: "bg-expense text-white",
  },
  {
    label: "Transfer",
    value: "transfer",
    activeColorClass: "bg-transfer text-white",
  },
  {
    label: "Adjustment",
    value: "adjustment",
    activeColorClass: "bg-info text-white",
  },
  {
    label: "Deleted",
    value: "deleted",
    activeColorClass: "bg-secondary-text text-white",
  },
];
