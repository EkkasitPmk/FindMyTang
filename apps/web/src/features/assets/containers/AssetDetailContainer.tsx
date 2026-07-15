"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";
import { useSearchParams, useRouter } from "next/navigation";
import { useAssets, useAssetUIStore } from "../hooks/assets.hook";
import {
  useInfiniteTransactionsQuery,
  useAvailableDatesQuery,
} from "../../transactions/hooks/transaction.hook";
import { groupTransactionsByDate } from "../helpers/asset-transactions.helper";
import { MONTHS } from "@/shared/lib/configs/date.config";
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
  const resetFilters = useAssetUIStore((state) => state.resetFilters);

  useEffect(() => {
    return () => resetFilters();
  }, [resetFilters]);

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

  const { data: availableDatesData } = useAvailableDatesQuery(asset?.id);
  const availableYears = useMemo(
    () =>
      Object.keys(availableDatesData ?? {}).sort((a, b) => b.localeCompare(a)),
    [availableDatesData],
  );

  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const monthRef = useRef<HTMLDivElement>(null);
  useClickOutside(monthRef, () => setIsMonthOpen(false), isMonthOpen);

  const [isYearOpen, setIsYearOpen] = useState(false);
  const yearRef = useRef<HTMLDivElement>(null);
  useClickOutside(yearRef, () => setIsYearOpen(false), isYearOpen);

  const [selectedMonth, setSelectedMonth] = useState("Select");
  const [selectedYear, setSelectedYear] = useState("Select");

  const effectiveYear = useMemo(() => {
    if (isSearchMode)
      return ["All time", ...availableYears].includes(selectedYear)
        ? selectedYear
        : "All time";
    return availableYears.includes(selectedYear)
      ? selectedYear
      : availableYears[0] || "Select";
  }, [selectedYear, availableYears, isSearchMode]);

  const availableMonths = useMemo(() => {
    if (
      isSearchMode ||
      effectiveYear === "Select" ||
      effectiveYear === "All time"
    )
      return [];
    return (availableDatesData?.[effectiveYear] || []).sort(
      (a, b) =>
        MONTHS.indexOf(b as (typeof MONTHS)[number]) -
        MONTHS.indexOf(a as (typeof MONTHS)[number]),
    );
  }, [availableDatesData, effectiveYear, isSearchMode]);

  const effectiveMonth = useMemo(() => {
    if (isSearchMode) return "Select";
    return availableMonths.includes(selectedMonth)
      ? selectedMonth
      : availableMonths[0] || "Select";
  }, [selectedMonth, availableMonths, isSearchMode]);

  const { from, to } = useMemo(() => {
    if (isSearchMode) {
      if (effectiveYear !== "All time") {
        return {
          from: new Date(Number(effectiveYear), 0, 1).toISOString(),
          to: new Date(Number(effectiveYear), 11, 31, 23, 59, 59).toISOString(),
        };
      }
      return { from: undefined, to: undefined };
    }
    if (effectiveYear !== "Select") {
      const year = Number(effectiveYear);
      if (effectiveMonth !== "Select") {
        const monthIndex = MONTHS.indexOf(
          effectiveMonth as (typeof MONTHS)[number],
        );
        const lastDay = new Date(year, monthIndex + 1, 0).getDate();
        return {
          from: new Date(year, monthIndex, 1).toISOString(),
          to: new Date(year, monthIndex, lastDay, 23, 59, 59).toISOString(),
        };
      }
      return {
        from: new Date(year, 0, 1).toISOString(),
        to: new Date(year, 11, 31, 23, 59, 59).toISOString(),
      };
    }
    return { from: undefined, to: undefined };
  }, [effectiveYear, effectiveMonth, isSearchMode]);

  const {
    data: transactionsData,
    isPending: isTransactionsPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteTransactionsQuery(
    asset
      ? {
          assetId: asset.id,
          isDeleted: viewOption === "Show deleted items",
          sortType,
          type: filterType === "ALL" ? undefined : filterType,
          searchKeyword: isSearchMode ? searchKeyword : undefined,
          from,
          to,
        }
      : undefined,
  );
  const isLoadingTransactions = !mounted || isTransactionsPending;

  const groupedTransactions = useMemo(() => {
    if (!transactionsData) return [];
    const allItems = transactionsData.pages.flatMap((p) => p.items);
    return groupTransactionsByDate(allItems);
  }, [transactionsData]);

  const months = availableMonths;
  const years = isSearchMode ? ["All time", ...availableYears] : availableYears;

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
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
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
