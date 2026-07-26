import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  GroupedTransaction,
  TransactionResponse,
} from "@/shared/lib/types/transaction.type";
import { TransactionItem } from "./TransactionItem";
import { TransactionGroupHeader } from "./TransactionGroupHeader";
import { renderGroupContent } from "./TransactionVirtuosoGroup";
import { renderItemContent } from "./TransactionVirtuosoItem";
import { TransactionVirtuosoFooter } from "./TransactionVirtuosoFooter";
import { cn } from "@/shared/lib/utils/core.util";
import TransactionListSkeleton from "../skeletons/TransactionListSkeleton";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { GroupedVirtuoso } from "react-virtuoso";
import { TranslationKey } from "@/shared/lib/configs/translations.config";

const SKELETON_GROUPS = Array.from({ length: 3 }, (_, i) => i);

export interface TransactionListProps {
  groupedTransactions: GroupedTransaction[];
  isLoadingTransactions: boolean;
  isFetchingNextPage?: boolean;
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
  useVirtualization?: boolean;
  onEndReached?: () => void;
}

export interface VirtuosoContext {
  groupedTransactions: GroupedTransaction[];
  flatItems: TransactionResponse[];
  t: (key: TranslationKey) => string;
  locale: string;
  assetId?: string;
  expandedTransactionId: string | null;
  setExpandedTransactionId: (id: string | null) => void;
  onTransactionItemClick: (transaction: TransactionResponse) => void;
  onRestoreClick?: (transaction: TransactionResponse) => void;
  onDeleteClick?: (transaction: TransactionResponse) => void;
  onAttachmentClick?: (url: string) => void;
  isFetchingNextPage?: boolean;
}

export function TransactionList({
  groupedTransactions,
  isLoadingTransactions,
  isFetchingNextPage = false,
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
  useVirtualization = false,
  onEndReached,
}: Readonly<TransactionListProps>) {
  const { t, locale } = useTranslation();
  const flatItems = groupedTransactions?.flatMap((group) => group.items) || [];

  const virtuosoContext: VirtuosoContext = {
    groupedTransactions,
    flatItems,
    t,
    locale,
    assetId,
    expandedTransactionId,
    setExpandedTransactionId,
    onTransactionItemClick,
    onRestoreClick,
    onDeleteClick,
    onAttachmentClick,
    isFetchingNextPage,
  };

  if (isSearchMode && !searchKeyword) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-disabled-text">
        <p>{t("typeToSearchTransactions")}</p>
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

  if (useVirtualization) {
    if (!groupedTransactions?.length) {
      return (
        <div className="text-secondary-text h-100 flex items-center justify-center">
          {isSearchMode
            ? "No matching transactions found"
            : "No transactions found"}
        </div>
      );
    }

    const groupCounts = groupedTransactions.map((group) => group.items.length);

    return (
      <section className="bg-surface h-full">
        <GroupedVirtuoso
          className="h-full w-full"
          groupCounts={groupCounts}
          endReached={onEndReached}
          context={virtuosoContext}
          groupContent={renderGroupContent}
          itemContent={renderItemContent}
          components={{
            Footer: TransactionVirtuosoFooter,
          }}
        />
      </section>
    );
  }

  return (
    <section
      className={cn(
        "bg-surface space-y-2",
        !groupedTransactions?.length && "bg-transparent",
      )}
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
            ),
          )}
        </div>
      ))}
      {!groupedTransactions?.length && (
        <div className="text-secondary-text h-50 flex items-center justify-center">
          {isSearchMode
            ? "No matching transactions found"
            : "No transactions found"}
        </div>
      )}
    </section>
  );
}
