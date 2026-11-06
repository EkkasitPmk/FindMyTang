import { Dispatch, SetStateAction, RefObject, useMemo } from "react";
import { Asset } from "@/shared/lib/types/asset.type";
import { GroupedTransaction } from "@/shared/lib/types/transaction.type";
import { cn } from "@/shared/lib/utils/core.util";
import { TransactionListContainer } from "@/features/transactions/containers/TransactionListContainer";
import AssetPageSkeleton from "./AssetPageSkeleton";
import AssetDetailBalanceCard from "./AssetDetailBalanceCard";
import AssetDetailViewOption from "./AssetDetailViewOption";
import AssetDetailBottomBar from "./AssetDetailBottomBar";
import { AssetFilterType, AssetMonthlySummary } from "../types/assets.type";
import { getFilterTransactionCount } from "../helpers/asset-detail.helper";
export type { AssetMonthlySummary, AssetFilterType };

const VIEW_OPTIONS_LIST = ["recentTransactions", "showDeletedItems"];

interface AssetDetailProps {
  asset?: Asset;
  groupedTransactions: GroupedTransaction[];
  summary?: AssetMonthlySummary;
  isLoading: boolean;
  isLoadingTransactions: boolean;
  isAddMenuOpen: boolean;
  onAddMenuToggle: () => void;
  onAddMenuClose: () => void;
  onTransferClick: () => void;
  onAdjustmentClick: () => void;
  onAddTransactionClick: () => void;
  onAddExpenseClick: () => void;
  onAddIncomeClick: () => void;
  selected: string;
  months: string[];
  handleSelect: (months: string) => void;
  years: string[];
  selectedYear: string;
  handleSelectYear: (year: string) => void;
  isMonthOpen: boolean;
  setIsMonthOpen: Dispatch<SetStateAction<boolean>>;
  isYearOpen: boolean;
  setIsYearOpen: Dispatch<SetStateAction<boolean>>;
  viewOption: string;
  isViewOptionOpen: boolean;
  viewOptionRef: RefObject<HTMLDivElement | null>;
  onViewOptionToggle: () => void;
  onViewOptionSelect: (option: string) => void;
  filterType?: AssetFilterType;
  onFilterSelect?: (type: AssetFilterType) => void;
  isSearchMode?: boolean;
  searchKeyword?: string;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  translateDropdownItem: (item: string) => string;
  onEditSavings?: () => void;
}

export default function AssetDetail({
  asset,
  groupedTransactions,
  summary,
  isLoading,
  isLoadingTransactions,
  isAddMenuOpen,
  onAddMenuToggle,
  onAddMenuClose,
  onTransferClick,
  onAdjustmentClick,
  onAddTransactionClick,
  onAddExpenseClick,
  onAddIncomeClick,
  selected,
  months,
  handleSelect,
  years,
  selectedYear,
  handleSelectYear,
  isMonthOpen,
  setIsMonthOpen,
  isYearOpen,
  setIsYearOpen,
  viewOption,
  isViewOptionOpen,
  viewOptionRef,
  onViewOptionToggle,
  onViewOptionSelect,
  filterType = "ALL",
  onFilterSelect,
  isSearchMode,
  searchKeyword,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  translateDropdownItem,
  onEditSavings,
}: Readonly<AssetDetailProps>) {
  const totalTransactionsCount = useMemo(
    () => getFilterTransactionCount(filterType, summary),
    [filterType, summary],
  );

  if (isLoading) return <AssetPageSkeleton />;

  return (
    <div className="relative flex flex-col h-full space-y-3">
      {!isSearchMode && (
        <>
          <AssetDetailBalanceCard
            asset={asset}
            summary={summary}
            selectedMonth={selected}
            months={months}
            handleSelectMonth={handleSelect}
            isMonthOpen={isMonthOpen}
            setIsMonthOpen={setIsMonthOpen}
            selectedYear={selectedYear}
            years={years}
            handleSelectYear={handleSelectYear}
            isYearOpen={isYearOpen}
            setIsYearOpen={setIsYearOpen}
            translateDropdownItem={translateDropdownItem}
            filterType={filterType}
            onFilterSelect={onFilterSelect}
            onEditSavings={onEditSavings}
          />

          <AssetDetailViewOption
            viewOption={viewOption}
            viewOptionsList={VIEW_OPTIONS_LIST}
            isViewOptionOpen={isViewOptionOpen}
            viewOptionRef={viewOptionRef}
            onViewOptionToggle={onViewOptionToggle}
            onViewOptionSelect={onViewOptionSelect}
            isLoadingTransactions={isLoadingTransactions}
            filterType={filterType}
            totalTransactionsCount={totalTransactionsCount}
            onClearFilter={() => onFilterSelect?.("ALL")}
          />
        </>
      )}

      <section
        className={cn(
          "flex-1 relative flex flex-col min-h-0 m-0",
          isSearchMode && "pb-6",
        )}
      >
        <TransactionListContainer
          groupedTransactions={groupedTransactions}
          isLoadingTransactions={isLoadingTransactions}
          assetId={asset?.id}
          isSearchMode={isSearchMode}
          searchKeyword={searchKeyword}
          page="asset"
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </section>

      {!isSearchMode && (
        <AssetDetailBottomBar
          assetColor={asset?.color}
          isAddMenuOpen={isAddMenuOpen}
          onAddTransactionClick={onAddTransactionClick}
          onAddMenuToggle={onAddMenuToggle}
          onAddMenuClose={onAddMenuClose}
          onAddExpenseClick={onAddExpenseClick}
          onAddIncomeClick={onAddIncomeClick}
          onTransferClick={onTransferClick}
          onAdjustmentClick={onAdjustmentClick}
        />
      )}
    </div>
  );
}
