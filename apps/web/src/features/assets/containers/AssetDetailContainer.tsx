"use client";
import { useState, useMemo, useRef } from "react";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";
import { useSearchParams, useRouter } from "next/navigation";
import { useAssets, useAssetUIStore } from "../hooks/assets.hook";
import { useTransactionsQuery } from "../../transactions/hooks/transaction.hook";
import { processAssetTransactions } from "../helpers/asset.helper";
import { useClickOutside } from "@/shared/lib/hooks/useClickOutside.hook";
import EditAssetsContainer from "./EditAssetsContainer";
import AssetDetail from "../components/AssetDetail";
import ManageAssetsContainer from "./ManageAssetsContainer";

export default function AssetDetailContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const mounted = useMounted();

  const { data: assets, isPending: isAssetsPending } = useAssets();
  const isLoading = !mounted || isAssetsPending;
  const searchKeyword = useAssetUIStore((state) => state.searchKeyword);
  const isSearchMode = useAssetUIStore((state) => state.isSearchMode);
  const filterType = useAssetUIStore((state) => state.filterType);
  const sortType = useAssetUIStore((state) => state.sortType);

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

  const { data: transactionsData, isPending: isTransactionsPending } =
    useTransactionsQuery(
      asset
        ? {
            assetId: asset.id,
            limit: 9999,
            isDeleted: viewOption === "Show deleted items",
            sortType,
          }
        : undefined,
    );
  const isLoadingTransactions = !mounted || isTransactionsPending;

  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const monthRef = useRef<HTMLDivElement>(null);
  useClickOutside(monthRef, () => setIsMonthOpen(false), isMonthOpen);

  const [isYearOpen, setIsYearOpen] = useState(false);
  const yearRef = useRef<HTMLDivElement>(null);
  useClickOutside(yearRef, () => setIsYearOpen(false), isYearOpen);

  const [selectedMonth, setSelectedMonth] = useState("Select");
  const [selectedYear, setSelectedYear] = useState("Select");

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
        searchKeyword,
        isSearchMode,
        filterType,
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
    }, [
      transactionsData,
      selectedYear,
      selectedMonth,
      searchKeyword,
      isSearchMode,
      filterType,
    ]);

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
            isSearchMode={isSearchMode}
            searchKeyword={searchKeyword}
          />
          {isEditModalOpen && asset && (
            <EditAssetsContainer
              asset={asset}
              onClose={() => setIsEditModalOpen(false)}
            />
          )}
        </>
      )}
    </>
  );
}
