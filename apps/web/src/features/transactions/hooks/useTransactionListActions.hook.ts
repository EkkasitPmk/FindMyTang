import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { TransactionResponse } from "@/shared/lib/types/transaction.type";

export function useTransactionListActions(openDeleteModal: () => void) {
  const router = useRouter();
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [transactionToRestore, setTransactionToRestore] =
    useState<TransactionResponse | null>(null);
  const [transactionToDelete, setTransactionToDelete] =
    useState<TransactionResponse | null>(null);

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
