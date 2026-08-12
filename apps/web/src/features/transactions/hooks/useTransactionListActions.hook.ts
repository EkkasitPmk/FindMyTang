import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { TransactionResponse } from "@/shared/lib/types/transaction.type";
import { useTransactionSheetStore } from "./transaction-sheet.hook";

export function useTransactionListActions(openDeleteModal: () => void) {
  const router = useRouter();
  const openTransactionSheet = useTransactionSheetStore((state) => state.open);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [transactionToRestore, setTransactionToRestore] =
    useState<TransactionResponse | null>(null);
  const [transactionToDelete, setTransactionToDelete] =
    useState<TransactionResponse | null>(null);

  const handleTransactionItemClick = useCallback(
    (transaction: TransactionResponse) => {
      const isDesktop = globalThis.matchMedia("(min-width: 1024px)").matches;
      if (isDesktop) {
        openTransactionSheet(transaction);
        return;
      }
      const url = new URL(
        isDesktop ? globalThis.location.href : "/transaction",
        globalThis.location.origin,
      );
      if (isDesktop) {
        url.searchParams.set("transactionType", transaction.type);
        url.searchParams.set("transactionId", transaction.id);
        if (transaction.assetId) {
          url.searchParams.set("transactionAssetId", transaction.assetId);
        } else {
          url.searchParams.delete("transactionAssetId");
        }
        if (transaction.deletedAt) {
          url.searchParams.set("transactionDeleted", "true");
        } else {
          url.searchParams.delete("transactionDeleted");
        }
      } else {
        url.searchParams.set("type", transaction.type);
        url.searchParams.set("id", transaction.id);
        if (transaction.assetId) {
          url.searchParams.set("assetId", transaction.assetId);
        }
        if (transaction.deletedAt) {
          url.searchParams.set("isDeleted", "true");
        }
      }

      if (isDesktop) {
        router.push(url.pathname + url.search, { scroll: false });
        openTransactionSheet();
        return;
      }
      router.push(url.pathname + url.search);
    },
    [openTransactionSheet, router],
  );

  const handleRestoreClick = useCallback((transaction: TransactionResponse) => {
    setTransactionToRestore(transaction);
    setIsRestoreModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback(
    (transaction: TransactionResponse) => {
      setTransactionToDelete(transaction);
      openDeleteModal();
    },
    [openDeleteModal],
  );

  return {
    isRestoreModalOpen,
    setIsRestoreModalOpen,
    transactionToRestore,
    setTransactionToRestore,
    transactionToDelete,
    setTransactionToDelete,
    handleTransactionItemClick,
    handleRestoreClick,
    handleDeleteClick,
  };
}
