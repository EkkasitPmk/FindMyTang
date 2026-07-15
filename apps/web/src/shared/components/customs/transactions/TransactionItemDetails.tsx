import Image from "next/image";
import { TransactionResponse } from "@/features/transactions/types/transaction.type";
import { cn } from "@/shared/lib/utils/core.util";
import { Button } from "@/shared/components/customs/Button";
import { RotateCcw, Trash } from "lucide-react";
import { useCachedImageUrl } from "@/shared/lib/hooks/useCachedImageUrl.hook";
import { getTimeDisplay } from "@/shared/lib/helpers/transaction-item.helper";

export interface TransactionItemDetailsProps {
  transaction: TransactionResponse;
  isIncomeOrExpense: boolean;
  isAdjustment: boolean;
  isTransfer: boolean;
  onTransactionItemClick: (transaction: TransactionResponse) => void;
  onRestoreClick?: (transaction: TransactionResponse) => void;
  onDeleteClick?: (transaction: TransactionResponse) => void;
  onAttachmentClick?: (url: string) => void;
  currentAssetId?: string;
}

export function TransactionItemDetails({
  transaction,
  isIncomeOrExpense,
  isAdjustment,
  isTransfer,
  onTransactionItemClick,
  onRestoreClick,
  onDeleteClick,
  onAttachmentClick,
  currentAssetId,
}: Readonly<TransactionItemDetailsProps>) {
  const cachedAttachmentUrl = useCachedImageUrl(transaction.attachmentUrl);
  const timeDisplay = getTimeDisplay(transaction.transactionDate);

  return (
    <div className="px-4 pb-3 text-sm space-y-px">
      {isIncomeOrExpense && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-secondary-text capitalize">Transaction Type:</p>
            <p className="capitalize font-medium">
              {transaction.type.toLowerCase()}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-secondary-text capitalize">Description:</p>
            <p className="font-medium text-right">{transaction.note || "-"}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-secondary-text capitalize">Category:</p>
            <p className="font-medium">{transaction.category?.name || "-"}</p>
          </div>
        </>
      )}

      {isAdjustment && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-secondary-text capitalize">Adjustment:</p>
            <p className="font-medium">
              {transaction.amount >= 0 ? "+" : ""}
              {transaction.amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-secondary-text capitalize">Description:</p>
            <p className="font-medium text-right">{transaction.note || "-"}</p>
          </div>
        </>
      )}

      {isTransfer && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-secondary-text capitalize">
              {currentAssetId === transaction.toAssetId
                ? "Transfer (From):"
                : "Transfer (To):"}
            </p>
            <p className="font-medium">
              {currentAssetId === transaction.toAssetId
                ? transaction.asset?.name || "-"
                : transaction.toAsset?.name || "-"}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-secondary-text capitalize">Description:</p>
            <p className="font-medium text-right">{transaction.note || "-"}</p>
          </div>
        </>
      )}

      <div className="flex items-center justify-between">
        <p className="text-secondary-text capitalize">Date:</p>
        <p className="font-medium">{timeDisplay}</p>
      </div>

      {cachedAttachmentUrl && (
        <div className="mt-2 flex items-center justify-between">
          <p className="text-secondary-text capitalize">Attachment:</p>
          <button
            type="button"
            className={cn(
              "relative h-16 w-16 overflow-hidden rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary",
              onAttachmentClick &&
                "cursor-pointer hover:opacity-80 transition-opacity",
            )}
            onClick={() => {
              if (onAttachmentClick) {
                onAttachmentClick(cachedAttachmentUrl);
              }
            }}
          >
            <Image
              src={cachedAttachmentUrl}
              alt="attachment"
              fill
              className="object-cover"
              sizes="64px"
            />
          </button>
        </div>
      )}

      <div
        className={cn(
          "gap-2 w-full mt-2",
          transaction.deletedAt && onRestoreClick ? "flex flex-col" : "flex",
        )}
      >
        <div
          className={cn(
            "flex",
            transaction.deletedAt && onRestoreClick ? "gap-2" : "w-full",
          )}
        >
          <Button
            variant="unstyled"
            className="flex-1 py-2 text-center text-primary font-medium border border-border hover:bg-surface-secondary rounded-md transition-colors"
            onClick={() => onTransactionItemClick(transaction)}
          >
            Edit{" "}
            {transaction.type.charAt(0) +
              transaction.type.slice(1).toLowerCase()}
          </Button>

          {transaction.deletedAt && onRestoreClick && (
            <Button
              variant="unstyled"
              className="flex-1 py-2 flex items-center justify-center gap-1.5 text-income font-medium border border-border hover:bg-surface-secondary rounded-md transition-colors"
              onClick={() => onRestoreClick(transaction)}
            >
              <RotateCcw size={16} />
              Restore
            </Button>
          )}
        </div>

        <div
          className={cn(
            transaction.deletedAt && onRestoreClick ? "w-full" : "w-44",
          )}
        >
          <Button
            variant="unstyled"
            className="flex-1 w-full py-2 flex items-center justify-center gap-1.5 text-expense font-medium border border-border hover:bg-surface-secondary rounded-md transition-colors"
            onClick={() => onDeleteClick?.(transaction)}
          >
            <Trash size={16} />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
