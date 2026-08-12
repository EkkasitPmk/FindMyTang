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
  getTransactionDateRange,
  shouldFetchTransactions,
  shouldShowAssetLoading,
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
  const sortType = useAssetUIStore((state) => state.sortType);
  const resetFilters = useAssetUIStore((state) => state.resetFilters);
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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
  const monthRef = useRef<HTMLDivElement>(null);

  const [isYearOpen, setIsYearOpen] = useState(false);
  const yearRef = useRef<HTMLDivElement>(null);

  const [selectedMonth, setSelectedMonth] = useState("Select");
  const [selectedYear, setSelectedYear] = useState("Select");

  useEffect(() => {
    if (!isSearchMode) return undefined;
    const timeoutId = window.setTimeout(() => {
      setSelectedMonth("Select");
      setSelectedYear("All time");
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [id, isSearchMode]);

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
        }
      : undefined,
    {
      enabled: canFetchTransactions,
    },
  );
  const isLoadingTransactions =
    (!isSearchMode && isAvailableDatesPending) ||
    (isTransactionsFetching &&
      !isFetchingNextPage &&
      (isTransactionsPending || isSearchMode));

  const groupedTransactions = useMemo(() => {
    if (!transactionsData) return [];
    const seen = new Set<string>();
    const allItems = transactionsData.pages
      .flatMap((p) => p.items)
      .filter((tx) => {
        if (seen.has(tx.id)) return false;
        seen.add(tx.id);
        return true;
      });
    return groupTransactionsByDate(allItems);
  }, [transactionsData]);

  const months = availableMonths;
  const years = isSearchMode ? ["All time", ...availableYears] : availableYears;

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
    [id, router, searchParams],
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
            searchKeyword={debouncedSearchKeyword}
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
