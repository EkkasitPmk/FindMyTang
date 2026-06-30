import React from "react";
import Image from "next/image";
import { formatDisplayDate } from "../../transactions/helpers/date.helper";
import { ArrowRightLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { TransactionResponse } from "../../transactions/types/transaction.type";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/customs/Button";
import { getCategoryIcon } from "@/shared/lib/configs/category-icons.config";

export interface TransactionItemProps {
  transaction: TransactionResponse;
  expandedTransactionId: string | null;
  setExpandedTransactionId: (id: string | null) => void;
  onTransactionItemClick: (transaction: TransactionResponse) => void;
}

export function TransactionItem({
  transaction,
  expandedTransactionId,
  setExpandedTransactionId,
  onTransactionItemClick,
}: Readonly<TransactionItemProps>) {
  const isIncome = transaction.type === "INCOME";
  const isExpense = transaction.type === "EXPENSE";

  let iconElement = null;
  let amountColorClass = "text-gray-800";
  let amountPrefix = "";

  if (isIncome) {
    amountColorClass = "text-green-600";
    amountPrefix = "+";
  } else if (isExpense) {
    amountColorClass = "text-red-600";
    amountPrefix = "-";
  }

  if (transaction.category) {
    const icon = getCategoryIcon(
      transaction.category.icon,
      transaction.category.type,
    );
    iconElement = (
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
  } else if (transaction.type === "TRANSFER") {
    iconElement = (
      <span className="bg-gray-100 rounded-full p-2 text-blue-500">
        <ArrowRightLeft size={18} />
      </span>
    );
  } else if (transaction.type === "ADJUSTMENT") {
    iconElement = (
      <span className="bg-gray-100 rounded-full p-2 text-purple-500">
        <SlidersHorizontal size={18} />
      </span>
    );
  }

  const isAdjustment = transaction.type === "ADJUSTMENT";
  const isTransfer = transaction.type === "TRANSFER";
  const isIncomeOrExpense = isIncome || isExpense;
  const isExpanded = expandedTransactionId === transaction.id;

  let displayTitle =
    transaction.category?.name || transaction.note || transaction.type;
  if (isAdjustment || isTransfer) {
    displayTitle = transaction.type.toLowerCase();
  }

  const txDate = new Date(transaction.transactionDate);
  const dateString = String(transaction.transactionDate);
  const isNoTime =
    dateString.includes("T00:00:00") ||
    (txDate.getHours() === 0 &&
      txDate.getMinutes() === 0 &&
      txDate.getSeconds() === 0);

  let timeDisplay = "";
  if (isNoTime) {
    timeDisplay = formatDisplayDate(txDate);
  } else {
    timeDisplay = txDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return (
    <div>
      <Button
        variant="unstyled"
        type="button"
        onClick={() =>
          setExpandedTransactionId(
            expandedTransactionId === transaction.id ? null : transaction.id,
          )
        }
        className="w-full text-left flex items-center justify-between px-3 py-2 cursor-pointer bg-surface-secondary hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {iconElement}
          <div className="flex flex-col leading-5">
            <span className="text-base capitalize">{displayTitle}</span>
            <span className="text-xs text-gray-500">{timeDisplay}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-base ${amountColorClass}`}>
            {amountPrefix}฿
            {transaction.amount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <ChevronRight
            size={18}
            className={cn(
              "text-gray-400 transition-transform",
              isExpanded && "rotate-90",
            )}
          />
        </div>
      </Button>

      {/* Expandable Detail */}
      {isExpanded && (
        <div className="px-4 py-3 bg-white rounded-bl-md rounded-br-md border-t-0 border border-border text-sm space-y-2">
          {isIncomeOrExpense && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-gray-500 capitalize">Transaction Type</p>
                <p className="capitalize font-medium">
                  {transaction.type.toLowerCase()}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-500 capitalize">Description</p>
                <p className="font-medium text-right">
                  {transaction.note || "-"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-500 capitalize">Category</p>
                <p className="font-medium">
                  {transaction.category?.name || "-"}
                </p>
              </div>
            </>
          )}

          {isAdjustment && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-gray-500 capitalize">Adjustment</p>
                <p className="font-medium">
                  {transaction.amount >= 0 ? "+" : ""}
                  {transaction.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-500 capitalize">Description</p>
                <p className="font-medium text-right">
                  {transaction.note || "-"}
                </p>
              </div>
            </>
          )}

          {isTransfer && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-gray-500 capitalize">Transfer (To)</p>
                <p className="font-medium">
                  {transaction.toAsset?.name || "-"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-500 capitalize">Description</p>
                <p className="font-medium text-right">
                  {transaction.note || "-"}
                </p>
              </div>
            </>
          )}

          <div className="flex items-center justify-between">
            <p className="text-gray-500 capitalize">Date</p>
            <p className="font-medium">
              {new Date(transaction.transactionDate).toLocaleDateString(
                "en-GB",
                {
                  day: "numeric",
                  month: "long",
                  year: "2-digit",
                },
              )}
            </p>
          </div>

          {transaction.attachmentUrl && (
            <div className="pt-2">
              <p className="text-gray-500 mb-2 capitalize">Attachment</p>
              <Image
                src={transaction.attachmentUrl}
                alt="attachment"
                width={64}
                height={64}
                className="h-16 w-16 object-cover rounded-md border border-gray-200"
              />
            </div>
          )}

          <Button
            variant="unstyled"
            className="w-full mt-2 py-2 text-center text-primary font-medium border border-border hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => onTransactionItemClick(transaction)}
          >
            Edit{" "}
            {transaction.type.charAt(0) +
              transaction.type.slice(1).toLowerCase()}
          </Button>
        </div>
      )}
    </div>
  );
}
