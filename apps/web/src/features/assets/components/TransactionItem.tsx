import { ChevronDown } from "lucide-react";
import { TransactionResponse } from "../../transactions/types/transaction.type";
import { cn } from "@/shared/lib/utils/core.util";
import { Button } from "@/shared/components/customs/Button";
import { TransactionItemDetails } from "./TransactionItemDetails";
import { TransactionIcon } from "./TransactionIcon";
import {
  getTransferDetails,
  getAmountDisplayConfig,
  getDisplayTitle,
  getTimeDisplay,
} from "../helpers/transaction-item.helper";

export interface TransactionItemProps {
  transaction: TransactionResponse;
  expandedTransactionId: string | null;
  setExpandedTransactionId: (id: string | null) => void;
  onTransactionItemClick: (transaction: TransactionResponse) => void;
  onRestoreClick?: (transaction: TransactionResponse) => void;
  onDeleteClick?: (transaction: TransactionResponse) => void;
  onAttachmentClick?: (url: string) => void;
  currentAssetId?: string;
}

export function TransactionItem({
  transaction,
  expandedTransactionId,
  setExpandedTransactionId,
  onTransactionItemClick,
  onRestoreClick,
  onDeleteClick,
  onAttachmentClick,
  currentAssetId,
}: Readonly<TransactionItemProps>) {
  const isAdjustment = transaction.type === "ADJUSTMENT";
  const isTransfer = transaction.type === "TRANSFER";
  const { isTransferIn, isTransferOut } = getTransferDetails(
    transaction,
    currentAssetId,
  );
  const { amountColorClass, amountPrefix, isIncome, isExpense } =
    getAmountDisplayConfig(transaction.type, isTransferIn, isTransferOut);

  const displayTitle = getDisplayTitle(transaction);
  const timeDisplay = getTimeDisplay(transaction.transactionDate);

  const isIncomeOrExpense = isIncome || isExpense;
  const isExpanded = expandedTransactionId === transaction.id;

  return (
    <div className="bg-surface-secondary">
      <Button
        variant="unstyled"
        type="button"
        onClick={() =>
          setExpandedTransactionId(
            expandedTransactionId === transaction.id ? null : transaction.id,
          )
        }
        className="w-full text-left flex items-center justify-between px-4 py-2 cursor-pointer bg-surface-secondary hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <TransactionIcon transaction={transaction} />
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
          <ChevronDown
            size={18}
            className={cn(
              "text-gray-400 transition-transform",
              isExpanded && "-rotate-x-180",
            )}
          />
        </div>
      </Button>

      {/* Expandable Detail */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="w-[92%] h-px px-4 mx-auto my-2 bg-border" />
          <TransactionItemDetails
            transaction={transaction}
            isIncomeOrExpense={isIncomeOrExpense}
            isAdjustment={isAdjustment}
            isTransfer={isTransfer}
            onTransactionItemClick={onTransactionItemClick}
            onRestoreClick={onRestoreClick}
            onDeleteClick={onDeleteClick}
            onAttachmentClick={onAttachmentClick}
            currentAssetId={currentAssetId}
          />
        </div>
      </div>
    </div>
  );
}
