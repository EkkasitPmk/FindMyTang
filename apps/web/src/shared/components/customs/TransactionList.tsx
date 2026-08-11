import { Skeleton } from "@/shared/components/ui/skeleton";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  GroupedTransaction,
  TransactionResponse,
} from "@/shared/lib/types/transaction.type";
import { TransactionItem } from "./TransactionItem";
import { TransactionGroupHeader } from "./TransactionGroupHeader";
import { cn } from "@/shared/lib/utils/core.util";
import TransactionListSkeleton from "../skeletons/TransactionListSkeleton";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { Virtuoso } from "react-virtuoso";

const SKELETON_GROUPS = Array.from({ length: 3 }, (_, i) => i);

interface TransactionListVirtuosoContext {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  t: ReturnType<typeof useTranslation>["t"];
  locale: string;
  assetId?: string;
  expandedTransactionId: string | null;
  setExpandedTransactionId: (id: string | null) => void;
  onTransactionItemClick: (transaction: TransactionResponse) => void;
  onRestoreClick?: (transaction: TransactionResponse) => void;
  onDeleteClick?: (transaction: TransactionResponse) => void;
  onAttachmentClick?: (url: string) => void;
}

type VirtualTransactionRow =
  | { kind: "group"; key: string; group: GroupedTransaction }
  | {
      kind: "item";
      key: string;
      transaction: TransactionResponse;
      isLastItem: boolean;
    };

function renderVirtualTransactionRow(
  _index: number,
  row: VirtualTransactionRow,
  context: TransactionListVirtuosoContext,
) {
  if (row.kind === "group") {
    return (
      <TransactionGroupHeader
        group={row.group}
        t={context.t}
        locale={context.locale}
        className="bg-surface py-1.5 px-4 pb-2"
      />
    );
  }

  return (
    <div className={cn(row.isLastItem && "pb-4")}>
      <TransactionItem
        transaction={row.transaction}
        isLastItem={row.isLastItem}
        currentAssetId={context.assetId}
        expandedTransactionId={context.expandedTransactionId}
        setExpandedTransactionId={context.setExpandedTransactionId}
        onTransactionItemClick={context.onTransactionItemClick}
        onRestoreClick={context.onRestoreClick}
        onDeleteClick={context.onDeleteClick}
        onAttachmentClick={context.onAttachmentClick}
      />
    </div>
  );
}

function TransactionListFooter({
  context,
}: Readonly<{
  context?: TransactionListVirtuosoContext;
}>) {
  if (context?.hasNextPage) {
    return (
      <div className="h-30 overflow-hidden py-4" aria-live="polite">
        {context.isFetchingNextPage && <TransactionListSkeleton />}
      </div>
    );
  }

  return <div className="h-18" aria-hidden="true" />;
}

interface TransactionListProps {
  groupedTransactions: GroupedTransaction[];
  isLoadingTransactions: boolean;
  isFetchingTransactions?: boolean;
  isFetchingNextPage?: boolean;
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
  useVirtualization?: boolean;
  onEndReached?: () => void;
  paginationKey?: string;
}

export function TransactionList({
  groupedTransactions,
  isLoadingTransactions,
  isFetchingTransactions = false,
  isFetchingNextPage = false,
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
  useVirtualization = false,
  onEndReached,
  paginationKey,
}: Readonly<TransactionListProps>) {
  const { t, locale } = useTranslation();
  const fetchLock = useRef(false);
  const lastRequestedLength = useRef(0);
  const flatItems = useMemo(
    () => groupedTransactions.flatMap((group) => group.items),
    [groupedTransactions],
  );
  const virtualRows = useMemo(
    () =>
      groupedTransactions.flatMap((group) => [
        { kind: "group" as const, key: `group-${group.dateStr}`, group },
        ...group.items.map((transaction, index) => ({
          kind: "item" as const,
          key: transaction.id,
          transaction,
          isLastItem: index === group.items.length - 1,
        })),
      ]),
    [groupedTransactions],
  );
  const virtuosoContext: TransactionListVirtuosoContext = {
    isFetchingNextPage,
    hasNextPage,
    t,
    locale,
    assetId,
    expandedTransactionId,
    setExpandedTransactionId,
    onTransactionItemClick,
    onRestoreClick,
    onDeleteClick,
    onAttachmentClick,
  };

  useEffect(() => {
    if (!isFetchingNextPage) fetchLock.current = false;
  }, [isFetchingNextPage]);

  useEffect(() => {
    fetchLock.current = false;
    lastRequestedLength.current = 0;
  }, [paginationKey]);

  const requestNextPage = useCallback(() => {
    if (
      !onEndReached ||
      !hasNextPage ||
      isFetchingTransactions ||
      isFetchingNextPage ||
      fetchLock.current ||
      lastRequestedLength.current === flatItems.length
    ) {
      return;
    }

    fetchLock.current = true;
    lastRequestedLength.current = flatItems.length;
    onEndReached();
  }, [
    flatItems.length,
    hasNextPage,
    isFetchingTransactions,
    isFetchingNextPage,
    onEndReached,
  ]);

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

  if (useVirtualization) {
    if (!groupedTransactions.length) {
      return (
        <div className="text-secondary-text h-100 flex items-center justify-center">
          {isSearchMode
            ? t("noMatchingTransactionsFound")
            : t("noTransactionsFound")}
        </div>
      );
    }

    return (
      <section className="h-full">
        <Virtuoso
          key={paginationKey}
          className="h-full w-full"
          data={virtualRows}
          computeItemKey={(_index, row) => row.key}
          itemContent={renderVirtualTransactionRow}
          increaseViewportBy={{ top: 400, bottom: 1000 }}
          rangeChanged={({ endIndex }) => {
            if (endIndex >= virtualRows.length - 8) requestNextPage();
          }}
          context={virtuosoContext}
          components={{
            Footer: TransactionListFooter,
          }}
        />
      </section>
    );
  }

  if (!groupedTransactions?.length) {
    return (
      <div className="text-secondary-text h-100 flex items-center justify-center">
        {isSearchMode
          ? t("noMatchingTransactionsFound")
          : t("noTransactionsFound")}
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
    </section>
  );
}
