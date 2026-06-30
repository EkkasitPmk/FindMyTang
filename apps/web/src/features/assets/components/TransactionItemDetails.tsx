import Image from "next/image";
import { TransactionResponse } from "../../transactions/types/transaction.type";
import { cn } from "@/shared/lib/utils/core.util";
import { Button } from "@/shared/components/customs/Button";
import { RotateCcw, Trash } from "lucide-react";

export interface TransactionItemDetailsProps {
  transaction: TransactionResponse;
  isIncomeOrExpense: boolean;
  isAdjustment: boolean;
  isTransfer: boolean;
  onTransactionItemClick: (transaction: TransactionResponse) => void;
  onRestoreClick?: (transaction: TransactionResponse) => void;
  onDeleteClick?: (transaction: TransactionResponse) => void;
}

export function TransactionItemDetails({
  transaction,
  isIncomeOrExpense,
  isAdjustment,
  isTransfer,
  onTransactionItemClick,
  onRestoreClick,
  onDeleteClick,
}: Readonly<TransactionItemDetailsProps>) {
  return (
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
            <p className="font-medium text-right">{transaction.note || "-"}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-500 capitalize">Category</p>
            <p className="font-medium">{transaction.category?.name || "-"}</p>
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
            <p className="font-medium text-right">{transaction.note || "-"}</p>
          </div>
        </>
      )}

      {isTransfer && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-gray-500 capitalize">Transfer (To)</p>
            <p className="font-medium">{transaction.toAsset?.name || "-"}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-500 capitalize">Description</p>
            <p className="font-medium text-right">{transaction.note || "-"}</p>
          </div>
        </>
      )}

      <div className="flex items-center justify-between">
        <p className="text-gray-500 capitalize">Date</p>
        <p className="font-medium">
          {new Date(transaction.transactionDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "2-digit",
          })}
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
            className="flex-1 py-2 text-center text-primary font-medium border border-border hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => onTransactionItemClick(transaction)}
          >
            Edit{" "}
            {transaction.type.charAt(0) +
              transaction.type.slice(1).toLowerCase()}
          </Button>

          {transaction.deletedAt && onRestoreClick && (
            <Button
              variant="unstyled"
              className="flex-1 py-2 flex items-center justify-center gap-1.5 text-green-600 font-medium border border-border hover:bg-gray-100 rounded-md transition-colors"
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
            className="flex-1 w-full py-2 flex items-center justify-center gap-1.5 text-red-500 font-medium border border-border hover:bg-gray-100 rounded-md transition-colors"
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
