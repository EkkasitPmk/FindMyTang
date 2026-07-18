"use client";
import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TransactionList } from "@/shared/components/customs/transactions/TransactionList";
import TransactionListSkeleton from "@/shared/components/skeletons/TransactionListSkeleton";
import ConfirmModal from "@/shared/components/customs/ConfirmModal";
import LoadingModal from "@/shared/components/customs/LoadingModal";
import ImagePreviewModal from "@/shared/components/customs/ImagePreviewModal";
import { useConfirmModal } from "@/shared/lib/hooks/useConfirmModal.hook";
import {
  useDeleteTransactionMutation,
  useUpdateTransactionMutation,
} from "@/features/transactions/hooks/transaction.hook";
import { toast } from "react-toastify";
import { RotateCcw, Trash } from "lucide-react";
import {
  GroupedTransaction,
  TransactionResponse,
} from "@/features/transactions/types/transaction.type";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

interface TransactionListContainerProps {
  groupedTransactions: GroupedTransaction[];
  isLoadingTransactions: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  isSearchMode?: boolean;
  searchKeyword?: string;
  assetId?: string;
  page?: "asset" | "journal" | "recent";
}

export function TransactionListContainer({
  groupedTransactions,
  isLoadingTransactions,
  isFetchingNextPage = false,
  hasNextPage = false,
  fetchNextPage,
  isSearchMode,
  searchKeyword,
  assetId,
  page,
}: Readonly<TransactionListContainerProps>) {
  const router = useRouter();
  const { t } = useTranslation();

  const [expandedTransactionId, setExpandedTransactionId] = useState<
    string | null
  >(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Restore logic
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [transactionToRestore, setTransactionToRestore] =
    useState<TransactionResponse | null>(null);

  const restoreTransaction = useUpdateTransactionMutation({
    onSuccess: () => {
      toast.success(t("transactionRestoredSuccess"));
    },
  });

  // Delete logic
  const {
    isOpen: isDeleteModalOpen,
    open: openDeleteModal,
    close: closeDeleteModal,
    isHardDelete,
    setIsHardDelete,
  } = useConfirmModal();

  const [transactionToDelete, setTransactionToDelete] =
    useState<TransactionResponse | null>(null);

  const deleteTransaction = useDeleteTransactionMutation({
    onSuccess: () => {
      toast.success(t("transactionDeletedSuccess"));
    },
  });

  const handleTransactionItemClick = useCallback(
    (transaction: TransactionResponse) => {
      const url = new URL("/transaction", globalThis.location.origin);
      url.searchParams.set("type", transaction.type);
      url.searchParams.set("id", transaction.id);
      if (transaction.assetId) {
        url.searchParams.set("assetId", transaction.assetId);
      }
      if (transaction.deletedAt) {
        url.searchParams.set("isDeleted", "true");
      }
      router.push(url.pathname + url.search);
    },
    [router],
  );

  const handleRestoreClick = useCallback((tx: TransactionResponse) => {
    setTransactionToRestore(tx);
    setIsRestoreModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback(
    (tx: TransactionResponse) => {
      setTransactionToDelete(tx);
      openDeleteModal();
    },
    [openDeleteModal],
  );
  // Observer for Lazy Load (Infinite Scroll)
  const observer = useRef<IntersectionObserver | null>(null);
  const observerTarget = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingTransactions || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && fetchNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 0.1 },
      );

      if (node) observer.current.observe(node);
    },
    [isLoadingTransactions, isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  return (
    <>
      {groupedTransactions.some((group) =>
        group.items.some((transaction) => Boolean(transaction.deletedAt)),
      ) && (
        <p className="mb-2 px-4 text-xs text-secondary-text">
          {t("deletedTransactionsNotice")}
        </p>
      )}
      <TransactionList
        groupedTransactions={groupedTransactions}
        isLoadingTransactions={isLoadingTransactions}
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
      />

      {/* Trigger for Lazy load */}
      {hasNextPage && fetchNextPage && (
        <div ref={observerTarget} className="my-4">
          {isFetchingNextPage && (
            <div className="space-y-1">
              <TransactionListSkeleton />
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={isRestoreModalOpen}
        onClose={() => {
          setIsRestoreModalOpen(false);
          setTransactionToRestore(null);
        }}
        onConfirm={() => {
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
        icon={RotateCcw}
        title={t("restoreTransaction")}
        des={t("restoreTransactionDesc")}
        confirmLabel={t("restore")}
        variant="success"
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          closeDeleteModal();
          setTransactionToDelete(null);
        }}
        onConfirm={() => {
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
        icon={Trash}
        title={
          transactionToDelete?.deletedAt
            ? t("deletePermanently")
            : t("deleteTransaction")
        }
        des={
          transactionToDelete?.deletedAt
            ? t("deletePermanentlyDesc")
            : t("deleteTransactionDesc")
        }
        confirmLabel={t("delete")}
        variant="danger"
        withHardDeleteOption={!transactionToDelete?.deletedAt}
        isHardDelete={isHardDelete}
        onHardDeleteChange={setIsHardDelete}
        hardDeleteCheckboxLabel={t("deletePermanently")}
      />

      <LoadingModal
        isOpen={restoreTransaction.isPending || deleteTransaction.isPending}
      />

      <ImagePreviewModal
        isOpen={!!previewImageUrl}
        onClose={() => setPreviewImageUrl(null)}
        imageUrl={previewImageUrl || ""}
      />
    </>
  );
}
