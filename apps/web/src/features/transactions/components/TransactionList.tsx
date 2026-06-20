import React from "react";
import { TransactionResponse } from "../types/transaction.type";

interface TransactionListProps {
  transactions: TransactionResponse[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 w-full max-w-2xl mx-auto px-2">
      {transactions.map((tx) => {
        const date = new Date(tx.transactionDate);
        const formattedDate = date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        const isExpense = tx.type === "EXPENSE";
        const categoryIcon = tx.category?.icon || "💰";
        const categoryName = tx.category?.name || "Uncategorized";
        const assetName = tx.asset?.name || "Unknown Asset";

        return (
          <div
            key={tx.id}
            className="p-4 rounded-xl border border-outline-variant flex items-center justify-between hover:bg-surface-container transition-colors active-press ambient-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm">
                {categoryIcon}
              </div>
              <div className="flex flex-col">
                <span className="">
                  {categoryName}
                </span>
                <div className="flex items-center space-x-2 text-on-surface-variant">
                  <span>{assetName}</span>
                  <span className="text-[10px] opacity-30">•</span>
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={`font-numeric-data text-lg ${
                  isExpense ? "text-error" : "text-primary"
                }`}
              >
                {isExpense ? "-" : "+"}
                {tx.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </span>
              {tx.note && (
                <span className="text-xs text-on-surface-variant opacity-70 mt-1 max-w-[120px] truncate">
                  {tx.note}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
