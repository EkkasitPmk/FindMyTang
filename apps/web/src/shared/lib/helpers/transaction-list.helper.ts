import { TransactionResponse } from "@/features/transactions/types/transaction.type";

export const calculateNetTotal = (items: TransactionResponse[]) => {
  return items.reduce((acc, transaction) => {
    if (transaction.type === "INCOME") return acc + transaction.amount;
    if (transaction.type === "EXPENSE") return acc - transaction.amount;
    if (transaction.type === "ADJUSTMENT") return acc + transaction.amount;
    if (transaction.type === "TRANSFER") return acc - transaction.amount;
    return acc;
  }, 0);
};

export const getTopRowText = (diffDays: number | null) => {
  if (diffDays === 0) return "Today";
  if (diffDays === -1) return "Yesterday";
  if (diffDays === 1) return "Tomorrow";

  if (diffDays !== null) {
    if (diffDays % 7 === 0) {
      const weeks = Math.abs(diffDays) / 7;
      const suffix = weeks > 1 ? "s" : "";
      if (diffDays > 0) return `In ${weeks} week${suffix}`;
      return `${weeks} week${suffix} ago`;
    }
    if (diffDays > 0) return `In ${Math.abs(diffDays)} days`;
    return `${Math.abs(diffDays)} days ago`;
  }

  return "";
};

export const getNetTotalConfig = (netTotal: number) => {
  if (netTotal > 0) return { colorClass: "text-green-600", prefix: "+" };
  if (netTotal < 0) return { colorClass: "text-red-600", prefix: "-" };
  return { colorClass: "text-gray-500", prefix: "" };
};
