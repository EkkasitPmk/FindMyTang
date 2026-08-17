import { Skeleton } from "@/shared/components/ui/skeleton";
import { RefObject } from "react";
import {
  GroupedTransaction,
  TransactionResponse,
} from "@/shared/lib/types/transaction.type";
import { TransactionItem } from "./TransactionItem";
import { TransactionGroupHeader } from "./TransactionGroupHeader";
import { cn } from "@/shared/lib/utils/core.util";
import TransactionListSkeleton from "../skeletons/TransactionListSkeleton";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

const SKELETON_GROUPS = Array.from({ length: 3 }, (_, i) => i);

interface TransactionListProps {
  groupedTransactions: GroupedTransaction[];
  isLoadingTransactions: boolean;
  hasNextPage?: boolean;
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
  transactionListRef?: RefObject<HTMLDivElement | null>;
}

export function TransactionList({
  groupedTransactions,
  isLoadingTransactions,
  hasNextPage = false,
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
  transactionListRef,
}: Readonly<TransactionListProps>) {
  const { t, locale } = useTranslation();
  const emptyMessage = t(
    isSearchMode ? "noMatchingTransactionsFound" : "noTransactionsFound",
  );

  if (isSearchMode && !searchKeyword) {
    return (
      <div className="flex flex-col items-center justify-center h-100 text-secondary-text">
        <p>{t("typeToSearchTransactions")}</p>
      </div>
    );
  }

  if (isLoadingTransactions) {
    if (isSearchMode) {
      return (
        <section className="flex flex-col gap-4">
          {SKELETON_GROUPS.map((i) => (
            <div key={`search-skeleton-group-${i}`} className="my-1">
              <TransactionListSkeleton />
            </div>
          ))}
        </section>
      );
    }

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
        <section className="space-y-4">
          {SKELETON_GROUPS.map((i) => (
            <div
              key={`skeleton-group-tx-${i}`}
              className={cn("space-y-1", "my-1 mb-3")}
            >
              <TransactionListSkeleton />
            </div>
          ))}
        </section>
      </>
    );
  }

  if (!groupedTransactions?.length) {
    return (
      <div
        className={cn(
          "text-secondary-text h-100 flex items-center justify-center",
          page === "journal" && transactionListRef && "h-40",
        )}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <section
      className={cn("space-y-2 pb-20", (isSearchMode || hasNextPage) && "pb-0")}
    >
      {groupedTransactions.map((group) => (
        <div
          key={group.dateStr}
          className="relative"
          data-date-group={group.dateStr}
        >
          <TransactionGroupHeader
            group={group}
            t={t}
            locale={locale}
            className="sticky top-0 bg-surface z-10 py-1.5 px-4"
          />
          {group.items.map(
            (transaction: TransactionResponse, txIndex: number) => (
              <div key={transaction.id} data-transaction-id={transaction.id}>
                <TransactionItem
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
              </div>
            ),
          )}
        </div>
      ))}
    </section>
  );
}
