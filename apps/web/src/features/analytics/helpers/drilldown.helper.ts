import { format } from "date-fns";
import { DrilldownTransaction } from "../schemas/analytics.response.schema";

export const getTxTime = (dateStr: string): string | null => {
  const txDate = new Date(dateStr);
  const isMidnight =
    dateStr.includes("T00:00:00") ||
    (txDate.getHours() === 0 &&
      txDate.getMinutes() === 0 &&
      txDate.getSeconds() === 0);
  return isMidnight ? null : format(txDate, "HH:mm");
};

export const getTxAmountDisplay = (
  type: string,
  amount: number,
): { signPrefix: string; colorClass: string } => {
  if (type === "TRANSFER") {
    return { signPrefix: "", colorClass: "text-primary-text" };
  }
  const isPositive = type === "INCOME" || (type === "ADJUSTMENT" && amount > 0);
  return {
    signPrefix: isPositive ? "+" : "-",
    colorClass: isPositive ? "text-income" : "text-expense",
  };
};

export const getAssetBadgeStyle = (
  color?: string | null,
): { color: string; backgroundColor: string } => ({
  color: color || "var(--chart-2)",
  backgroundColor: color?.startsWith("#")
    ? `${color}1A`
    : "var(--surface-secondary)",
});

export const groupTransactionsByDate = (
  transactions: DrilldownTransaction[],
): Record<string, { dateObj: Date; txs: DrilldownTransaction[] }> => {
  return transactions.reduce(
    (acc, tx) => {
      const txDate = new Date(tx.date);
      const dateKey = format(txDate, "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = {
          dateObj: txDate,
          txs: [],
        };
      }
      acc[dateKey].txs.push(tx);
      return acc;
    },
    {} as Record<string, { dateObj: Date; txs: DrilldownTransaction[] }>,
  );
};
