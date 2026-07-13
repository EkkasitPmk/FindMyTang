import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  GroupedTransaction,
  TransactionResponse,
} from "@/features/transactions/types/transaction.type";
import { getDiffDays } from "@/shared/lib/helpers/date.helper";
import {
  calculateNetTotal,
  getTopRowText,
  getNetTotalConfig,
} from "@/shared/lib/helpers/transaction-list.helper";
import { TransactionItem } from "./TransactionItem";
import { cn } from "@/shared/lib/utils/core.util";
import TransactionListSkeleton from "../../skeletons/TransactionListSkeleton";

const SKELETON_GROUPS = Array.from({ length: 3 }, (_, i) => i);

export interface TransactionListProps {
  groupedTransactions: GroupedTransaction[];
  isLoadingTransactions: boolean;
  assetId?: string;
  onTransactionItemClick: (transaction: TransactionResponse) => void;
  onRestoreClick?: (transaction: TransactionResponse) => void;
  onDeleteClick?: (transaction: TransactionResponse) => void;
  isSearchMode?: boolean;
  searchKeyword?: string;
  page?: string;
  expandedTransactionId: string | null;
  setExpandedTransactionId: (id: string | null) => void;
  onAttachmentClick: (url: string) => void;
}

export function TransactionList({
  groupedTransactions,
  isLoadingTransactions,
  assetId,
  onTransactionItemClick,
  onRestoreClick,
  onDeleteClick,
  isSearchMode,
  searchKeyword,
  page,
  expandedTransactionId,
  setExpandedTransactionId,
  onAttachmentClick,
}: Readonly<TransactionListProps>) {
  if (isSearchMode && !searchKeyword) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <p>Type to search transactions</p>
      </div>
    );
  }

  if (isLoadingTransactions) {
    return (
      <>
        {page !== "journal" && (
          <section className="mb-4 px-4">
            <Skeleton className="h-4 w-14 mb-1" />
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-8 w-1/2 rounded-md" />
              <Skeleton className="h-8 w-1/2 rounded-md" />
            </div>
          </section>
        )}
        <div className="space-y-4">
          {SKELETON_GROUPS.map((i) => (
            <div
              key={`skeleton-group-tx-${i}`}
              className={cn("space-y-1", "my-1 mb-3")}
            >
              <TransactionListSkeleton />
              <Skeleton className="h-13 w-full rounded-none" />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="bg-white space-y-2">
      {groupedTransactions.map((group, index) => {
        const netTotal = calculateNetTotal(group.items);
        const txDate = new Date(group.items[0].transactionDate);
        const diffDays = getDiffDays(txDate);
        const topRow = getTopRowText(diffDays);

        const bottomRow = txDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
          year:
            txDate.getFullYear() !== new Date().getFullYear()
              ? "numeric"
              : undefined,
        });

        const { colorClass: netTotalColorClass, prefix: netTotalPrefix } =
          getNetTotalConfig(netTotal);

        return (
          <div key={`${group.dateStr}-${index}`} className="relative">
            <div
              className={cn(
                "sticky top-0 bg-white z-10 py-1.5 px-4",
                "flex justify-between items-center",
              )}
            >
              <div className="flex flex-col">
                <span className="text-base font-medium text-primary-text">
                  {topRow}
                </span>
                <span className="text-sm font-normal text-secondary-text capitalize">
                  {bottomRow}
                </span>
              </div>

              <span className={cn("text-sm", netTotalColorClass)}>
                {netTotalPrefix}฿
                {Math.abs(netTotal).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            {group.items.map((transaction, txIndex) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                isLastItem={txIndex === group.items.length - 1}
                currentAssetId={assetId}
                expandedTransactionId={expandedTransactionId}
                setExpandedTransactionId={setExpandedTransactionId}
                onTransactionItemClick={onTransactionItemClick}
                onRestoreClick={onRestoreClick}
                onDeleteClick={onDeleteClick}
                onAttachmentClick={onAttachmentClick}
              />
            ))}
          </div>
        );
      })}
      {!groupedTransactions?.length && (
        <div className="p-4 text-center text-gray-500">
          {isSearchMode
            ? "No matching transactions found"
            : "No transactions found"}
        </div>
      )}
    </div>
  );
}
