import { ChevronDown } from "lucide-react";
import { TransactionResponse } from "@/shared/lib/types/transaction.type";
import { cn } from "@/shared/lib/utils/core.util";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { TransactionItemDetails } from "./TransactionItemDetails";
import { TransactionIcon } from "./TransactionIcon";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import {
  getTransferDetails,
  getAmountDisplayConfig,
  getDisplayTitle,
} from "@/shared/lib/helpers/transaction-item.helper";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../animate-ui/primitives/radix/collapsible";

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
  const { locale } = useTranslation();
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
    <Collapsible
      open={isExpanded}
      onOpenChange={(open) => {
        setExpandedTransactionId(open ? transaction.id : null);
      }}
      className="group/collapsible"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="unstyled"
          type="button"
          hoverScale={1}
          tapScale={1}
          className={cn(
            "w-full text-left flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-surface-secondary focus:outline-none transition-colors",
            isExpanded && "focus:bg-surface-secondary",
          )}
        >
          <TransactionIcon transaction={transaction} />
          <div className="grid grid-cols-2 w-full">
            <div className="flex items-center gap-3">
              <div className="flex flex-col leading-5 text-left overflow-hidden mr-2">
                <span className="text-base capitalize truncate">
                  {displayTitle}
                </span>
                <span className="text-xs text-secondary-text truncate flex items-center gap-1">
                  {transaction.note && (
                    <span className="truncate">{transaction.note}</span>
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1">
              <span className={`text-base font-medium ${amountColorClass}`}>
                {amountPrefix}฿
                {Math.abs(transaction.amount).toLocaleString(locale, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <ChevronDown
                size={18}
                className="text-disabled-text transition-transform duration-300 group-data-[state=open]/collapsible:-rotate-180"
              />
            </div>
          </div>
        </Button>
      </CollapsibleTrigger>

      <div
        className={cn(
          "h-px transition-all duration-200 ml-auto mr-4",
          dividerClass,
        )}
      />

      {/* Expandable Detail */}
      <CollapsibleContent transition={{ duration: 0.25, ease: "easeInOut" }}>
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
      </CollapsibleContent>
    </Collapsible>
  );
}
