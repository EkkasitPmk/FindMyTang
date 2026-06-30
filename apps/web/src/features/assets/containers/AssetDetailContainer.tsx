"use client";
import { useState, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAssets } from "../hooks/assets.hook";
import {
  useTransactionsQuery,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} from "../../transactions/hooks/transaction.hook";
import { formatDisplayDate } from "../../transactions/helpers/date.helper";
import { toast } from "react-toastify";
import ConfirmModal from "@/shared/components/customs/ConfirmModal";
import { useConfirmModal } from "@/shared/lib/hooks/useConfirmModal.hook";
import { useClickOutside } from "@/shared/lib/hooks/useClickOutside.hook";
import LoadingModal from "@/shared/components/customs/LoadingModal";
import { RotateCcw, Trash } from "lucide-react";
import { TransactionResponse } from "../../transactions/types/transaction.type";
import EditAssetsContainer from "./EditAssetsContainer";
import AssetDetail from "../components/AssetDetail";
import ListAssetsContainer from "./ListAssetsContainer";

export default function AssetDetailContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const { data: assets, isLoading } = useAssets();

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

  const { data: transactionsData, isLoading: isLoadingTransactions } =
    useTransactionsQuery(
      asset
        ? {
            assetId: asset.id,
            limit: 9999,
            isDeleted: viewOption === "Show deleted items",
          }
        : undefined,
    );

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
      if (!transactionsData?.items?.length) {
        return {
          months: [] as string[],
          years: [] as string[],
          effectiveYear: "Select",
          effectiveMonth: "Select",
          groupedTransactions: [],
          filteredTransactionsData: {
            ...transactionsData,
            items: [],
          } as typeof transactionsData,
        };
      }

      // 1. Get all available years
      const yearsSet = new Set<string>();
      transactionsData.items.forEach((tx) => {
        yearsSet.add(new Date(tx.transactionDate).getFullYear().toString());
      });
      const availableYears = Array.from(yearsSet).sort((a, b) =>
        b.localeCompare(a),
      );

      // Determine effective year to filter by
      const effectiveYear = availableYears.includes(selectedYear)
        ? selectedYear
        : availableYears[0];

      // 2. Filter transactions by effective year
      let filteredItems = transactionsData.items.filter(
        (tx) =>
          new Date(tx.transactionDate).getFullYear().toString() ===
          effectiveYear,
      );

      // 3. Get all available months for the effective year
      const monthsSet = new Set<string>();
      filteredItems.forEach((tx) => {
        monthsSet.add(
          new Date(tx.transactionDate).toLocaleString("en-US", {
            month: "long",
          }),
        );
      });

      // Sort months descending (latest month to earliest month)
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const availableMonths = Array.from(monthsSet).sort(
        (a, b) => monthNames.indexOf(b) - monthNames.indexOf(a),
      );

      // Determine effective month
      const effectiveMonth = availableMonths.includes(selectedMonth)
        ? selectedMonth
        : availableMonths[0] || "Select";

      // 4. Filter transactions by effective month
      if (effectiveMonth !== "Select") {
        filteredItems = filteredItems.filter(
          (tx) =>
            new Date(tx.transactionDate).toLocaleString("en-US", {
              month: "long",
            }) === effectiveMonth,
        );
      }

      // The backend now filters by isDeleted, so we don't need to filter by deletedAt here.

      const groupedTransactions = (() => {
        const groups: { dateStr: string; items: typeof filteredItems }[] = [];
        let currentGroup: {
          dateStr: string;
          items: typeof filteredItems;
        } | null = null;

        filteredItems.forEach((tx) => {
          const txDate = new Date(tx.transactionDate);
          const dateStr = formatDisplayDate(txDate);

          if (currentGroup?.dateStr !== dateStr) {
            currentGroup = { dateStr, items: [] as typeof filteredItems };
            groups.push(currentGroup);
          }
          currentGroup.items.push(tx);
        });
        return groups;
      })();

      return {
        months: availableMonths,
        years: availableYears,
        effectiveYear,
        effectiveMonth,
        groupedTransactions,
        filteredTransactionsData: {
          ...transactionsData,
          items: filteredItems,
        },
      };
    }, [transactionsData, selectedYear, selectedMonth]);

  const handleSelectMonth = (month: string) => {
    setSelectedMonth(month);
  };

  return (
    <>
      {id === null ? (
        <ListAssetsContainer id={id} />
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
