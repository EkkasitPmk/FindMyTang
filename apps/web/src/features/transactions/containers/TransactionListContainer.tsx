"use client";
import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TransactionList } from "@/shared/components/customs/TransactionList";
import TransactionListSkeleton from "@/shared/components/skeletons/TransactionListSkeleton";
import ConfirmModal from "@/shared/components/customs/ConfirmModal";
import LoadingModal from "@/shared/components/customs/LoadingModal";
import ImagePreviewModal from "@/shared/components/customs/ImagePreviewModal";
import { useConfirmModal } from "@/shared/lib/hooks/useConfirmModal.hook";
import { useModalState } from "@/shared/lib/hooks/useModalState.hook";
import {
  useDeleteTransactionMutation,
  useUpdateTransactionMutation,
} from "@/features/transactions/hooks/transaction.hook";
import { RotateCcw, Trash } from "lucide-react";
import {
  TransactionResponse,
  GroupedTransaction,
} from "@/shared/lib/types/transaction.type";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { cn } from "@/shared/lib/utils/core.util";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/shared/lib/types/api.type";

interface TransactionListContainerProps {
  groupedTransactions: GroupedTransaction[];
  isLoadingTransactions: boolean;
  isFetchingTransactions?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  isSearchMode?: boolean;
  searchKeyword?: string;
  assetId?: string;
  page?: "asset" | "journal" | "recent";
  useVirtualization?: boolean;
  disableOwnScroll?: boolean;
  paginationKey?: string;
}

export function TransactionListContainer({
  groupedTransactions,
  isLoadingTransactions,
  isFetchingTransactions = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  fetchNextPage,
  isSearchMode,
  searchKeyword,
  assetId,
  page,
  useVirtualization = false,
  disableOwnScroll = false,
  paginationKey,
}: Readonly<TransactionListContainerProps>) {
  const router = useRouter();
  const { t } = useTranslation();

  const [expandedTransactionId, setExpandedTransactionId] = useState<
    string | null
  >(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const { modalState, setModalState, resetModalState } = useModalState();

  // Restore logic
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [transactionToRestore, setTransactionToRestore] =
    useState<TransactionResponse | null>(null);

  const restoreTransaction = useUpdateTransactionMutation({
    onSuccess: () => {
      setModalState({
        isOpen: true,
        status: "success",
        message:
          t("transactionRestoredSuccess") ||
          "Transaction restored successfully",
      });
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
      const msg = err.response?.data?.message;
      setModalState({
        isOpen: true,
        status: "error",
        message: Array.isArray(msg)
          ? msg[0]
          : msg || "Failed to restore transaction",
      });
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
      setModalState({
        isOpen: true,
        status: "success",
        message: t("transactionDeletedSuccess"),
      });
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
      const msg = err.response?.data?.message;
      setModalState({
        isOpen: true,
        status: "error",
        message: Array.isArray(msg)
          ? msg[0]
          : msg || "Failed to delete transaction",
      });
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

  const observer = useRef<IntersectionObserver | null>(null);
  const observerTarget = useCallback(
    (node: HTMLDivElement | null) => {
      observer.current?.disconnect();
      if (
        !node ||
        useVirtualization ||
        isLoadingTransactions ||
        isFetchingNextPage
      ) {
        return;
      }

      observer.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && hasNextPage && fetchNextPage) {
            fetchNextPage();
          }
        },
        { rootMargin: "800px 0px" },
      );
      observer.current.observe(node);
    },
    [
      useVirtualization,
      isLoadingTransactions,
      isFetchingNextPage,
      hasNextPage,
      fetchNextPage,
    ],
  );
  return (
    <div
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

      <div className={cn(useVirtualization && "flex-1 min-h-0")}>
        <TransactionList
          groupedTransactions={groupedTransactions}
          isLoadingTransactions={isLoadingTransactions}
          isFetchingTransactions={isFetchingTransactions}
          isFetchingNextPage={isFetchingNextPage}
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
          useVirtualization={useVirtualization}
          paginationKey={paginationKey}
          onEndReached={() => {
            if (
              hasNextPage &&
              !isFetchingTransactions &&
              !isFetchingNextPage &&
              fetchNextPage
            ) {
              fetchNextPage();
            }
          }}
        />
      </div>

      {!useVirtualization && hasNextPage && fetchNextPage && (
        <div ref={observerTarget} className="my-4 shrink-0">
          {isFetchingNextPage && <TransactionListSkeleton />}
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
        isOpen={
          modalState.isOpen ||
          restoreTransaction.isPending ||
          deleteTransaction.isPending
        }
        status={modalState.isOpen ? modalState.status : "loading"}
        message={modalState.isOpen ? modalState.message : undefined}
        onClose={resetModalState}
      />

      <ImagePreviewModal
        isOpen={!!previewImageUrl}
        onClose={() => setPreviewImageUrl(null)}
        imageUrl={previewImageUrl || ""}
      />
    </div>
  );
}
