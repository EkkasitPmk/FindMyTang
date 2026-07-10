"use client";
import { useState, useMemo, useRef } from "react";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";
import { useSearchParams, useRouter } from "next/navigation";
import { useAssets } from "../hooks/assets.hook";
import {
  useTransactionsQuery,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} from "../../transactions/hooks/transaction.hook";
import { processAssetTransactions } from "../helpers/asset.helper";
import { toast } from "react-toastify";
import ConfirmModal from "@/shared/components/customs/ConfirmModal";
import { useConfirmModal } from "@/shared/lib/hooks/useConfirmModal.hook";
import { useClickOutside } from "@/shared/lib/hooks/useClickOutside.hook";
import LoadingModal from "@/shared/components/customs/LoadingModal";
import { RotateCcw, Trash } from "lucide-react";
import { TransactionResponse } from "../../transactions/types/transaction.type";
import EditAssetsContainer from "./EditAssetsContainer";
import AssetDetail from "../components/AssetDetail";
import ManageAssetsContainer from "./ManageAssetsContainer";

export default function AssetDetailContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const mounted = useMounted();

  const {
    data: assets,
    isPending: isAssetsPending,
    isFetching: isAssetsFetching,
  } = useAssets();
  const isLoading = !mounted || isAssetsPending || isAssetsFetching;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [viewOption, setViewOption] = useState("Recent Transactions");
  const [isViewOptionOpen, setIsViewOptionOpen] = useState(false);
  const viewOptionRef = useRef<HTMLDivElement>(null);
  useClickOutside(
    viewOptionRef,
    () => setIsViewOptionOpen(false),
    isViewOptionOpen,
  );

  const asset = assets?.find((a) => a.id === id) || assets?.[0];

  const {
    data: transactionsData,
    isPending: isTransactionsPending,
    isFetching: isTransactionsFetching,
  } = useTransactionsQuery(
    asset
      ? {
          assetId: asset.id,
          limit: 9999,
          isDeleted: viewOption === "Show deleted items",
        }
      : undefined,
  );
  const isLoadingTransactions =
    !mounted || isTransactionsPending || isTransactionsFetching;

  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const monthRef = useRef<HTMLDivElement>(null);
  useClickOutside(monthRef, () => setIsMonthOpen(false), isMonthOpen);

  const [isYearOpen, setIsYearOpen] = useState(false);
  const yearRef = useRef<HTMLDivElement>(null);
  useClickOutside(yearRef, () => setIsYearOpen(false), isYearOpen);

  const [selectedMonth, setSelectedMonth] = useState("Select");
  const [selectedYear, setSelectedYear] = useState("Select");
  const [expandedTransactionId, setExpandedTransactionId] = useState<
    string | null
  >(null);

  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [transactionToRestore, setTransactionToRestore] =
    useState<TransactionResponse | null>(null);

  const restoreTransaction = useUpdateTransactionMutation({
    onSuccess: () => {
      toast.success("Transaction restored successfully!");
    },
  });

  const {
    isOpen: isDeleteModalOpen,
    open: openDeleteModal,
    close: closeDeleteModal,
    isHardDelete,
    setIsHardDelete,
    inputValue: confirmInput,
    setInputValue: setConfirmInput,
  } = useConfirmModal();

  const [transactionToDelete, setTransactionToDelete] =
    useState<TransactionResponse | null>(null);

  const deleteTransaction = useDeleteTransactionMutation({
    onSuccess: () => {
      toast.success("Transaction deleted successfully!");
    },
  });

  const { months, years, groupedTransactions, effectiveYear, effectiveMonth } =
    useMemo(() => {
      const {
        months,
        years,
        effectiveYear,
        effectiveMonth,
        groupedTransactions,
        filteredItems,
      } = processAssetTransactions({
        transactions: transactionsData?.items,
        selectedYear,
        selectedMonth,
      });

      return {
        months,
        years,
        effectiveYear,
        effectiveMonth,
        groupedTransactions,
        filteredTransactionsData: transactionsData
          ? {
              ...transactionsData,
              items: filteredItems,
            }
          : undefined,
      };
    }, [transactionsData, selectedYear, selectedMonth]);

  const handleSelectMonth = (month: string) => {
    setSelectedMonth(month);
  };

  return (
    <>
      {id === null ? (
        <ManageAssetsContainer />
      ) : (
        <>
          <AssetDetail
            asset={asset}
            groupedTransactions={groupedTransactions}
            isLoading={isLoading}
            isLoadingTransactions={isLoadingTransactions}
            isAddMenuOpen={isAddMenuOpen}
            onAddMenuToggle={() => setIsAddMenuOpen((prev) => !prev)}
            onAddMenuClose={() => setIsAddMenuOpen(false)}
            onTransferClick={() =>
              router.push(`/transaction?type=TRANSFER&assetId=${asset?.id}`)
            }
            onAdjustmentClick={() =>
              router.push(`/transaction?type=ADJUSTMENT&assetId=${asset?.id}`)
            }
            onEditClick={() => setIsEditModalOpen(true)}
            onAddTransactionClick={() =>
              router.push(`/transaction?assetId=${asset?.id}`)
            }
            onAddExpenseClick={() =>
              router.push(`/transaction?type=EXPENSE&assetId=${asset?.id}`)
            }
            onAddIncomeClick={() =>
              router.push(`/transaction?type=INCOME&assetId=${asset?.id}`)
            }
            onTransactionItemClick={(transaction) => {
              const url = new URL("/transaction", globalThis.location.origin);
              url.searchParams.set("type", transaction.type);
              url.searchParams.set("id", transaction.id);
              if (asset?.id) {
                url.searchParams.set("assetId", asset.id);
              }
              if (transaction.deletedAt) {
                url.searchParams.set("isDeleted", "true");
              }
              router.push(url.pathname + url.search);
            }}
            selected={effectiveMonth}
            months={months}
            handleSelect={handleSelectMonth}
            years={years}
            selectedYear={effectiveYear}
            handleSelectYear={setSelectedYear}
            isMonthOpen={isMonthOpen}
            setIsMonthOpen={setIsMonthOpen}
            isYearOpen={isYearOpen}
            setIsYearOpen={setIsYearOpen}
            expandedTransactionId={expandedTransactionId}
            setExpandedTransactionId={setExpandedTransactionId}
            viewOption={viewOption}
            isViewOptionOpen={isViewOptionOpen}
            viewOptionRef={viewOptionRef}
            onViewOptionToggle={() => setIsViewOptionOpen((prev) => !prev)}
            onViewOptionSelect={(option) => {
              setViewOption(option);
              setIsViewOptionOpen(false);
            }}
            monthRef={monthRef}
            yearRef={yearRef}
            onRestoreClick={(tx) => {
              setTransactionToRestore(tx);
              setIsRestoreModalOpen(true);
            }}
            onDeleteClick={(tx) => {
              setTransactionToDelete(tx);
              openDeleteModal();
            }}
          />
          {isEditModalOpen && asset && (
            <EditAssetsContainer
              asset={asset}
              onClose={() => setIsEditModalOpen(false)}
            />
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
            title="Restore Transaction"
            des="Are you sure you want to restore this transaction? It will be active again."
            confirmLabel="Restore"
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
                ? "Delete Permanently"
                : "Delete Transaction"
            }
            des={
              transactionToDelete?.deletedAt
                ? "Are you sure you want to permanently delete this transaction? This action cannot be undone."
                : "Are you sure you want to delete this transaction?"
            }
            confirmLabel="Delete"
            withHardDeleteOption={!transactionToDelete?.deletedAt}
            isHardDelete={isHardDelete}
            onHardDeleteChange={setIsHardDelete}
            inputValue={confirmInput}
            onInputChange={setConfirmInput}
          />
          <LoadingModal
            isOpen={restoreTransaction.isPending || deleteTransaction.isPending}
          />
        </>
      )}
    </>
  );
}
