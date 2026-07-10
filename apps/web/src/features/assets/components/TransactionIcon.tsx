import React from "react";
import { ArrowRightLeft, SlidersHorizontal } from "lucide-react";
import { TransactionResponse } from "../../transactions/types/transaction.type";
import { getCategoryIcon } from "@/shared/lib/configs/category-icons.config";

export interface TransactionIconProps {
  transaction: TransactionResponse;
}

export function TransactionIcon({
  transaction,
}: Readonly<TransactionIconProps>) {
  if (transaction.category) {
    const icon = getCategoryIcon(
      transaction.category.icon,
      transaction.category.type,
    );
    return (
      <span
        className="rounded-full p-2"
        style={{
          color: transaction.category.color,
          backgroundColor: `${transaction.category.color}33`,
        }}
      >
        {React.createElement(icon, { size: 18 })}
      </span>
    );
  }

  if (transaction.type === "TRANSFER") {
    return (
      <span className="bg-gray-100 rounded-full p-2 text-blue-500">
        <ArrowRightLeft size={18} />
      </span>
    );
  }

  if (transaction.type === "ADJUSTMENT") {
    return (
      <span className="bg-gray-100 rounded-full p-2 text-purple-500">
        <SlidersHorizontal size={18} />
      </span>
    );
  }

  return null;
}
