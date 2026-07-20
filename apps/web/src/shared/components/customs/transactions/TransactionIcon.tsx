import React from "react";
import { ArrowRightLeft, SlidersHorizontal } from "lucide-react";
import { TransactionResponse } from "@/features/transactions/types/transaction.type";
import { getCategoryIcon } from "@/shared/lib/configs/category-icons.config";

export interface TransactionIconProps {
  transaction: TransactionResponse;
}

export function TransactionIcon({
  transaction,
}: Readonly<TransactionIconProps>) {
  if (transaction.category) {
    const icon = getCategoryIcon(transaction.category.icon);
    return (
      <span
        className="rounded-lg p-2 relative inline-flex items-center justify-center overflow-hidden shrink-0"
        style={{ color: transaction.category.color }}
      >
        <span
          className="absolute inset-0 opacity-[0.15]"
          style={{ backgroundColor: transaction.category.color }}
        />
        <span className="relative z-10 flex items-center justify-center">
          {React.createElement(icon, { size: 18 })}
        </span>
      </span>
    );
  }

  if (transaction.type === "TRANSFER") {
    return (
      <span className="bg-surface-secondary rounded-lg p-2 text-transfer">
        <ArrowRightLeft size={18} />
      </span>
    );
  }

  if (transaction.type === "ADJUSTMENT") {
    return (
      <span className="bg-surface-secondary rounded-lg p-2 text-info">
        <SlidersHorizontal size={18} />
      </span>
    );
  }

  return null;
}
