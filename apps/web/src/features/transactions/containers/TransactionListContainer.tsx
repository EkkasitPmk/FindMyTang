"use client";
import {
  RefObject,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { TransactionList } from "@/shared/components/customs/TransactionList";
import TransactionListSkeleton from "@/shared/components/skeletons/TransactionListSkeleton";
import TransactionListModals from "../components/TransactionListModals";
import { useInfiniteTransactionScroll } from "../hooks/useInfiniteTransactionScroll.hook";
import { useTransactionListMutations } from "../hooks/useTransactionListMutations.hook";
import { useTransactionListActions } from "../hooks/useTransactionListActions.hook";
import { useConfirmModal } from "@/shared/lib/hooks/useConfirmModal.hook";
import { useModalState } from "@/shared/lib/hooks/useModalState.hook";
import {
  TransactionResponse,
  GroupedTransaction,
} from "@/shared/lib/types/transaction.type";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { cn } from "@/shared/lib/utils/core.util";
import {
  adjustScrollAnchor,
  hasFilterChanged,
  recordItemPositions,
} from "../helpers/transaction-scroll.helper";

interface TransactionListContainerProps {
  groupedTransactions: GroupedTransaction[];
  isLoadingTransactions: boolean;
  isFetchingNextPage?: boolean;
  isFetchingPreviousPage?: boolean;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  fetchNextPage?: () => void;
  fetchPreviousPage?: () => void;
  isSearchMode?: boolean;
  searchKeyword?: string;
  assetId?: string;
  page?: "asset" | "journal" | "recent";
  disableOwnScroll?: boolean;
  transactionListRef?: RefObject<HTMLDivElement | null>;
}

export function TransactionListContainer({
  groupedTransactions,
  isLoadingTransactions,
  isFetchingNextPage = false,
  isFetchingPreviousPage = false,
  hasNextPage = false,
  hasPreviousPage = false,
  fetchNextPage,
  fetchPreviousPage,
  isSearchMode,
  searchKeyword,
  assetId,
  page,
  disableOwnScroll = false,
  transactionListRef,
}: Readonly<TransactionListContainerProps>) {
  const { t } = useTranslation();
  const router = useRouter();

  const [expandedTransactionId, setExpandedTransactionId] = useState<
    string | null
  >(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const { modalState, setModalState, resetModalState } = useModalState();
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevFirstIdRef = useRef<string | undefined>(undefined);
  const prevFilterRef = useRef({ searchKeyword, assetId, isSearchMode });
  const itemPositionsRef = useRef<Map<string, number>>(new Map());

  const {
    isOpen: isDeleteModalOpen,
    open: openDeleteModal,
    close: closeDeleteModal,
    isHardDelete,
    setIsHardDelete,
  } = useConfirmModal();

  const {
    isRestoreModalOpen,
    setIsRestoreModalOpen,
    transactionToRestore,
    setTransactionToRestore,
    transactionToDelete,
    setTransactionToDelete,
    handleTransactionItemClick,
    handleRestoreClick,
    handleDeleteClick,
  } = useTransactionListActions(openDeleteModal);

  const { restoreTransaction, deleteTransaction } = useTransactionListMutations(
    {
      t,
      onSuccess: (message) => {
        setModalState({ isOpen: true, status: "success", message });
        router.refresh();
      },
      onError: (message) =>
        setModalState({ isOpen: true, status: "error", message }),
    },
  );

  useLayoutEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const currentFirstId = groupedTransactions[0]?.items[0]?.id;
    const filterChanged = hasFilterChanged(prevFilterRef.current, {
      searchKeyword,
      assetId,
      isSearchMode,
    });
    prevFilterRef.current = { searchKeyword, assetId, isSearchMode };

    const isPageShifted =
      prevFirstIdRef.current !== undefined &&
      currentFirstId !== prevFirstIdRef.current;

    if (!filterChanged && isPageShifted && currentFirstId) {
      const targetId = itemPositionsRef.current.has(currentFirstId)
        ? currentFirstId
        : prevFirstIdRef.current;

      if (targetId) {
        adjustScrollAnchor(scrollElement, targetId, itemPositionsRef.current);
      }
    }

    recordItemPositions(scrollElement, itemPositionsRef.current);
    prevFirstIdRef.current = currentFirstId;
  }, [groupedTransactions, assetId, isSearchMode, searchKeyword]);

  const handleFetchNextPage = useCallback(() => {
    fetchNextPage?.();
  }, [fetchNextPage]);

  const handleFetchPreviousPage = useCallback(() => {
    fetchPreviousPage?.();
  }, [fetchPreviousPage]);

  const onScroll = useInfiniteTransactionScroll({
    isLoadingTransactions,
    isFetchingPreviousPage,
    isFetchingNextPage,
    hasPreviousPage,
    hasNextPage,
    fetchPreviousPage: handleFetchPreviousPage,
    fetchNextPage: handleFetchNextPage,
  });

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className={cn(
        "flex flex-col h-full min-h-0 overflow-y-auto overscroll-contain",
        disableOwnScroll && "h-auto min-h-0 overflow-visible overscroll-auto",
      )}
    >
      {groupedTransactions.some((group) =>
        group.items.some((transaction: TransactionResponse) =>
          Boolean(transaction.deletedAt),
        ),
      ) && (
        <p className="mb-2 px-4 text-xs text-secondary-text shrink-0">
          {t("deletedTransactionsNotice")}
        </p>
      )}

      {hasPreviousPage && fetchPreviousPage && (
        <div
          className={cn("shrink-0", isFetchingPreviousPage ? "my-4" : "h-px")}
        >
          {isFetchingPreviousPage && <TransactionListSkeleton />}
        </div>
      )}

      <div>
        <TransactionList
          groupedTransactions={groupedTransactions}
          isLoadingTransactions={isLoadingTransactions}
          hasNextPage={hasNextPage}
          onTransactionItemClick={handleTransactionItemClick}
          onRestoreClick={handleRestoreClick}
          onDeleteClick={handleDeleteClick}
          isSearchMode={isSearchMode}
          searchKeyword={searchKeyword}
          assetId={assetId}
          page={page}
          expandedTransactionId={expandedTransactionId}
          setExpandedTransactionId={setExpandedTransactionId}
          onAttachmentClick={setPreviewImageUrl}
          transactionListRef={transactionListRef}
        />
      </div>

      {hasNextPage && fetchNextPage && (
        <div className={cn("my-4 shrink-0", page === "asset" && "pb-20")}>
          {isFetchingNextPage && <TransactionListSkeleton />}
        </div>
      )}

      <TransactionListModals
        isRestoreOpen={isRestoreModalOpen}
        onCloseRestore={() => {
          setIsRestoreModalOpen(false);
          setTransactionToRestore(null);
        }}
        onConfirmRestore={() => {
          if (transactionToRestore) {
            restoreTransaction.mutate({
              id: transactionToRestore.id,
              data: {
                deletedAt: null,
                type: transactionToRestore.type,
                amount: transactionToRestore.amount,
                transactionDate: transactionToRestore.transactionDate,
                assetId: transactionToRestore.assetId,
              },
            });
            setIsRestoreModalOpen(false);
            setTransactionToRestore(null);
          }
        }}
        restoreTitle={t("restoreTransaction")}
        restoreDescription={t("restoreTransactionDesc")}
        restoreLabel={t("restore")}
        isDeleteOpen={isDeleteModalOpen}
        onCloseDelete={() => {
          closeDeleteModal();
          setTransactionToDelete(null);
        }}
        onConfirmDelete={() => {
          if (transactionToDelete) {
            deleteTransaction.mutate({
              id: transactionToDelete.id,
              isHardDelete:
                Boolean(isHardDelete) || !!transactionToDelete.deletedAt,
            });
            closeDeleteModal();
            setTransactionToDelete(null);
          }
        }}
        deleteTitle={
          transactionToDelete?.deletedAt
            ? t("deletePermanently")
            : t("deleteTransaction")
        }
        deleteDescription={
          transactionToDelete?.deletedAt
            ? t("deletePermanentlyDesc")
            : t("deleteTransactionDesc")
        }
        deleteLabel={t("delete")}
        withHardDeleteOption={!transactionToDelete?.deletedAt}
        isHardDelete={isHardDelete}
        onHardDeleteChange={setIsHardDelete}
        hardDeleteLabel={t("deletePermanently")}
        loadingModal={{
          isOpen:
            modalState.isOpen ||
            restoreTransaction.isPending ||
            deleteTransaction.isPending,
          status: modalState.isOpen ? modalState.status : "loading",
          message: modalState.isOpen ? modalState.message : undefined,
        }}
        onCloseLoading={resetModalState}
        previewImageUrl={previewImageUrl}
        onClosePreview={() => setPreviewImageUrl(null)}
      />
    </div>
  );
}
