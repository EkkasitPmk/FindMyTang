"use client";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import { useIsGuest } from "@/shared/lib/storages/guest.storage";
import { useAssetUIStore } from "../hooks/assets.hook";
import { Asset } from "@/shared/lib/types/asset.type";
import {
  useInfiniteTransactionsQuery,
  useAvailableDatesQuery,
} from "../../transactions/hooks/transaction.hook";
import { groupTransactionsByDate } from "../helpers/asset-transactions.helper";
import {
  calculateAssetMonthlySummary,
  getAvailableMonths,
  getEffectiveMonth,
  getEffectiveYear,
  getTransactionDateRange,
  shouldFetchTransactions,
  shouldShowAssetLoading,
  shouldShowTransactionsLoading,
} from "../helpers/asset-detail.helper";
import { MONTHS } from "@/shared/lib/configs/date.config";
import EditAssetsContainer from "./EditAssetsContainer";
import AssetDetail from "../components/AssetDetail";
import ManageAssetsContainer from "./ManageAssetsContainer";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

export default function AssetDetailContainer({
  initialAssets,
  initialIncludeDeleted,
  initialAvailableDates,
  initialAvailableDatesAssetId,
}: Readonly<{
  initialAssets?: Asset[];
  initialIncludeDeleted?: boolean;
  initialAvailableDates?: Record<string, string[]>;
  initialAvailableDatesAssetId?: string;
}>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const { t, locale } = useTranslation();
  const isGuest = useIsGuest();

  const includeDeleted = id === null;
  const { data: assets, isPending: isAssetsPending } = useAssets({
    includeDeleted,
    initialData:
      includeDeleted === initialIncludeDeleted ? initialAssets : undefined,
  });
  const isLoading = shouldShowAssetLoading(
    isAssetsPending,
    isGuest,
    initialAssets !== undefined,
    includeDeleted,
    initialIncludeDeleted,
  );
  const searchKeyword = useAssetUIStore((state) => state.searchKeyword);
  const isSearchMode = useAssetUIStore((state) => state.isSearchMode);
  const filterType = useAssetUIStore((state) => state.filterType);
  const setFilterType = useAssetUIStore((state) => state.setFilterType);
  const sortType = useAssetUIStore((state) => state.sortType);
  const resetFilters = useAssetUIStore((state) => state.resetFilters);
  const isEditModalOpen = useAssetUIStore((state) => state.isEditModalOpen);
  const setIsEditModalOpen = useAssetUIStore(
    (state) => state.setIsEditModalOpen,
  );
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");

  useEffect(() => {
    const nextKeyword = isSearchMode ? searchKeyword.trim() : "";
    const timeoutId = window.setTimeout(
      () => {
        setDebouncedSearchKeyword(nextKeyword);
      },
      nextKeyword ? 300 : 0,
    );

    return () => window.clearTimeout(timeoutId);
  }, [isSearchMode, searchKeyword]);

  useEffect(() => {
    return () => resetFilters();
  }, [resetFilters]);

  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [viewOption, setViewOption] = useState("recentTransactions");
  const [isViewOptionOpen, setIsViewOptionOpen] = useState(false);
  const viewOptionRef = useRef<HTMLDivElement>(null);

  const asset = assets?.find((a: Asset) => a.id === id) || assets?.[0];

  const { data: availableDatesData, isPending: isAvailableDatesPending } =
    useAvailableDatesQuery(asset?.id, viewOption === "showDeletedItems", {
      initialData:
        !isGuest &&
        viewOption === "recentTransactions" &&
        asset?.id === initialAvailableDatesAssetId
          ? initialAvailableDates
          : undefined,
    });
  const availableYears = useMemo(
    () =>
      Object.keys(availableDatesData ?? {}).sort((a, b) => b.localeCompare(a)),
    [availableDatesData],
  );

  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState("Select");
  const [selectedYear, setSelectedYear] = useState("Select");

  const currentYearStr = useMemo(() => new Date().getFullYear().toString(), []);
  const currentMonthStr = useMemo(() => MONTHS[new Date().getMonth()], []);

  const effectiveYear = useMemo(
    () => getEffectiveYear(selectedYear, availableYears, currentYearStr),
    [selectedYear, availableYears, currentYearStr],
  );

  const availableMonths = useMemo(
    () =>
      getAvailableMonths(
        effectiveYear,
        availableDatesData,
        availableYears.length,
        currentMonthStr,
      ),
    [availableDatesData, effectiveYear, availableYears.length, currentMonthStr],
  );

  const effectiveMonth = useMemo(
    () => getEffectiveMonth(selectedMonth, availableMonths, currentMonthStr),
    [selectedMonth, availableMonths, currentMonthStr],
  );

  const { from, to } = useMemo(
    () => getTransactionDateRange(isSearchMode, effectiveYear, effectiveMonth),
    [effectiveYear, effectiveMonth, isSearchMode],
  );

  const canFetchTransactions = shouldFetchTransactions(
    isSearchMode,
    debouncedSearchKeyword,
    availableDatesData !== undefined,
  );

  const {
    data: transactionsData,
    isPending: isTransactionsPending,
    isFetching: isTransactionsFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteTransactionsQuery(
    asset
      ? {
          assetId: asset.id,
          isDeleted: viewOption === "showDeletedItems",
          sortType,
          type: filterType === "ALL" ? undefined : filterType,
          searchKeyword:
            isSearchMode && debouncedSearchKeyword
              ? debouncedSearchKeyword
              : undefined,
          from,
          to,
          limit: 100,
        }
      : undefined,
    {
      enabled: canFetchTransactions,
    },
  );
  const isLoadingTransactions = shouldShowTransactionsLoading(
    isSearchMode,
    isAvailableDatesPending,
    isTransactionsFetching,
    isFetchingNextPage,
    isTransactionsPending,
  );

  const allItems = useMemo(() => {
    if (!transactionsData) return [];
    const seen = new Set<string>();
    return transactionsData.pages
      .flatMap((p) => p.items)
      .filter((tx) => {
        if (seen.has(tx.id)) return false;
        seen.add(tx.id);
        return true;
      });
  }, [transactionsData]);

  const groupedTransactions = useMemo(() => {
    return groupTransactionsByDate(allItems);
  }, [allItems]);

  const summary = useMemo(
    () => calculateAssetMonthlySummary(allItems),
    [allItems],
  );

  const months =
    availableMonths.length > 0 ? availableMonths : [currentMonthStr];
  const years = availableYears.length > 0 ? availableYears : [currentYearStr];

  const handleSelectMonth = (month: string) => {
    setSelectedMonth(month);
  };

  const handleEditClose = useCallback(
    (newName?: string) => {
      setIsEditModalOpen(false);
      if (typeof newName === "string" && id) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("name", newName);
        router.replace(`/assets?${params.toString()}`);
      }
    },
    [id, router, searchParams, setIsEditModalOpen],
  );

  const translateDropdownItem = useCallback(
    (item: string) => {
      if (item === "Select") return t("selectOption");
      if (item === "All time") return t("allTime");

      const monthIndex = (MONTHS as readonly string[]).indexOf(item);
      if (monthIndex !== -1) {
        const d = new Date(2000, monthIndex, 1);
        return d.toLocaleString(locale, { month: "long" });
      }

      if (!Number.isNaN(Number(item))) {
        const year = Number(item);
        if (locale === "th-TH") return (year + 543).toString();
        return year.toString();
      }

      return item;
    },
    [t, locale],
  );

  return (
    <>
      {id === null ? (
        <ManageAssetsContainer initialAssets={assets} />
      ) : (
        <>
          <AssetDetail
            asset={asset}
            groupedTransactions={groupedTransactions}
            summary={summary}
            isLoading={isLoading && !isSearchMode}
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
            isSearchMode={isSearchMode}
            searchKeyword={debouncedSearchKeyword}
            filterType={filterType}
            onFilterSelect={setFilterType}
            fetchNextPage={canFetchTransactions ? fetchNextPage : undefined}
            hasNextPage={canFetchTransactions && hasNextPage}
            isFetchingNextPage={canFetchTransactions && isFetchingNextPage}
            translateDropdownItem={translateDropdownItem}
          />
          {isEditModalOpen && asset && (
            <EditAssetsContainer
              asset={asset}
              onClose={(newName) => handleEditClose(newName)}
            />
          )}
        </>
      )}
    </>
  );
}
