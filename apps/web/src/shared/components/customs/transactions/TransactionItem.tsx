import { ChevronDown } from "lucide-react";
import { TransactionResponse } from "@/features/transactions/types/transaction.type";
import { cn } from "@/shared/lib/utils/core.util";
import { Button } from "@/shared/components/customs/Button";
import { TransactionItemDetails } from "./TransactionItemDetails";
import { TransactionIcon } from "./TransactionIcon";
import {
  getTransferDetails,
  getAmountDisplayConfig,
  getDisplayTitle,
} from "@/shared/lib/helpers/transaction-item.helper";

export interface TransactionItemProps {
  transaction: TransactionResponse;
  expandedTransactionId: string | null;
  setExpandedTransactionId: (id: string | null) => void;
  onTransactionItemClick: (transaction: TransactionResponse) => void;
  onRestoreClick?: (transaction: TransactionResponse) => void;
  onDeleteClick?: (transaction: TransactionResponse) => void;
  onAttachmentClick?: (url: string) => void;
  currentAssetId?: string;
  isLastItem?: boolean;
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
  isLastItem,
}: Readonly<TransactionItemProps>) {
  const isAdjustment = transaction.type === "ADJUSTMENT";
  const isTransfer = transaction.type === "TRANSFER";
  const { isTransferIn, isTransferOut } = getTransferDetails(
    transaction,
    currentAssetId,
  );
  const { amountColorClass, amountPrefix, isIncome, isExpense } =
    getAmountDisplayConfig(
      transaction.type,
      isTransferIn,
      isTransferOut,
      transaction.amount,
    );

  const displayTitle = getDisplayTitle(transaction);

  const isIncomeOrExpense = isIncome || isExpense;
  const isExpanded = expandedTransactionId === transaction.id;

  let dividerClass = "w-[calc(100%-78px)] bg-border opacity-100";
  if (isExpanded) {
    dividerClass = "w-[calc(100%-32px)] mb-2 bg-border opacity-100";
  } else if (isLastItem) {
    dividerClass = "w-[calc(100%-78px)] bg-transparent opacity-0";
  }

  return (
    <>
      <Button
        variant="unstyled"
        type="button"
        onClick={() =>
          setExpandedTransactionId(
            expandedTransactionId === transaction.id ? null : transaction.id,
          )
        }
        className={cn(
          "w-full text-left flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors",
        )}
      >
        <TransactionIcon transaction={transaction} />
        <div className="grid grid-cols-2 w-full">
          <div className="flex items-center gap-3">
            <div className="flex flex-col leading-5 text-left overflow-hidden mr-2">
              <span className="text-base capitalize truncate">
                {displayTitle}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {transaction.note}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-1">
            <span className={`text-base ${amountColorClass}`}>
              {amountPrefix}฿
              {Math.abs(transaction.amount).toLocaleString("en-US", {
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
        </div>
      </Button>

      <div
        className={cn(
          "h-px transition-all duration-200 ml-auto mr-4",
          dividerClass,
        )}
      />

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
    </>
  );
}
