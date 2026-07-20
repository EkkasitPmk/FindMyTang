import { ChevronRight, Pencil } from "lucide-react";
import { Asset } from "../types/assets.type";
import { GroupedTransaction } from "../../transactions/types/transaction.type";
import { cn } from "@/shared/lib/utils/core.util";
import { Button } from "@/shared/components/customs/Button";
import { DropdownSelect } from "@/shared/components/customs/DropdownSelect";
import { Dispatch, SetStateAction, RefObject } from "react";
import { TransactionListContainer } from "@/features/transactions/containers/TransactionListContainer";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { TranslationKey } from "@/shared/lib/configs/translations.config";

const DEFAULT_ASSET_COLOR = "#2563EB";
const SKELETON_GROUPS = Array.from({ length: 3 }, (_, i) => i);

interface AssetDetailProps {
  asset?: Asset;
  groupedTransactions: GroupedTransaction[];
  isLoading: boolean;
  isLoadingTransactions: boolean;
  isAddMenuOpen: boolean;
  onAddMenuToggle: () => void;
  onAddMenuClose: () => void;
  onTransferClick: () => void;
  onAdjustmentClick: () => void;
  onEditClick: () => void;
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
  monthRef: RefObject<HTMLDivElement | null>;
  yearRef: RefObject<HTMLDivElement | null>;
  isSearchMode?: boolean;
  searchKeyword?: string;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  translateDropdownItem: (item: string) => string;
}

export default function AssetDetail({
  asset,
  groupedTransactions,
  isLoading,
  isLoadingTransactions,
  isAddMenuOpen,
  onAddMenuToggle,
  onAddMenuClose,
  onTransferClick,
  onAdjustmentClick,
  onEditClick,
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
  monthRef,
  yearRef,
  isSearchMode,
  searchKeyword,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  translateDropdownItem,
}: Readonly<AssetDetailProps>) {
  const { t, locale } = useTranslation();
  const viewOptionsList = ["recentTransactions", "showDeletedItems"];

  if (isLoading) {
    return (
      <div className="flex flex-col h-[calc(100vh-124px)] space-y-4">
        <section className="relative flex flex-col items-center justify-center mt-6">
          <Skeleton className="h-9 w-30 rounded-full mb-2" />
          <Skeleton className="h-10 w-48" />
        </section>
        <section className="mb-2 px-4">
          <Skeleton className="h-10 w-full rounded-md mb-1" />
          <Skeleton className="h-4 w-14 mb-1" />
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-8 w-1/2 rounded-md" />
            <Skeleton className="h-8 w-1/2 rounded-md" />
          </div>
        </section>
        <section className="flex-1 space-y-4 overflow-hidden">
          {SKELETON_GROUPS.map((i) => (
            <div key={`skeleton-group-${i}`} className="space-y-1 my-2">
              <Skeleton className="h-5 w-32 mx-4 mb-3" />
              <Skeleton className="h-13 w-full rounded-none" />
              <Skeleton className="h-13 w-full rounded-none" />
            </div>
          ))}
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-124px)] space-y-4">
      {!isSearchMode && (
        <section className="relative flex flex-col items-center justify-center mt-6">
          <div
            className="px-3 py-1 rounded-full bg-opacity-10 mb-2"
            style={{
              backgroundColor: `${asset?.color || DEFAULT_ASSET_COLOR}1A`,
            }}
          >
            <p
              className="font-semibold text-lg tracking-widest uppercase"
              style={{ color: asset?.color || undefined }}
            >
              {t("balance")}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="text-3xl font-bold opacity-80"
              style={{ color: asset?.color || undefined }}
            >
              ฿
            </span>
            <p className="text-3xl font-extrabold tracking-tight text-primary-text">
              {(asset?.balance ?? 0).toLocaleString(locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </section>
      )}

      {!isSearchMode && (
        <section className="mb-2 px-4">
          <DropdownSelect
            ref={viewOptionRef}
            options={viewOptionsList.map((opt) => t(opt as TranslationKey))}
            selected={t(viewOption as TranslationKey)}
            isOpen={isViewOptionOpen}
            onToggle={onViewOptionToggle}
            themeColor={asset?.color}
            onSelect={(selectedLabel) => {
              const originalKey =
                viewOptionsList.find(
                  (opt) => t(opt as TranslationKey) === selectedLabel,
                ) || viewOptionsList[0];
              onViewOptionSelect(originalKey);
            }}
            className="w-full text-base font-medium"
          />

          {groupedTransactions?.length > 0 && (
            <>
              <span className="text-secondary-text text-sm">{t("period")}</span>

              <div className="flex items-center justify-between gap-4">
                <DropdownSelect
                  ref={monthRef}
                  options={months.map(translateDropdownItem)}
                  selected={translateDropdownItem(selected)}
                  isOpen={isMonthOpen}
                  onToggle={() => setIsMonthOpen(!isMonthOpen)}
                  themeColor={asset?.color}
                  onSelect={(translatedMonth) => {
                    const originalKey =
                      months.find(
                        (opt) => translateDropdownItem(opt) === translatedMonth,
                      ) || months[0];
                    if (originalKey) handleSelect(originalKey);
                    setIsMonthOpen(false);
                  }}
                  className="grow"
                />
                <DropdownSelect
                  ref={yearRef}
                  options={years.map(translateDropdownItem)}
                  selected={translateDropdownItem(selectedYear)}
                  isOpen={isYearOpen}
                  onToggle={() => setIsYearOpen(!isYearOpen)}
                  themeColor={asset?.color}
                  onSelect={(translatedYear) => {
                    const originalKey =
                      years.find(
                        (opt) => translateDropdownItem(opt) === translatedYear,
                      ) || years[0];
                    if (originalKey) handleSelectYear(originalKey);
                    setIsYearOpen(false);
                  }}
                  className="grow"
                />
              </div>
            </>
          )}
        </section>
      )}

      <section className="flex-1 relative flex flex-col min-h-0 m-0">
        {isSearchMode && (
          <div className="flex items-end justify-end shrink-0">
            <DropdownSelect
              ref={yearRef}
              options={years.map(translateDropdownItem)}
              selected={translateDropdownItem(selectedYear)}
              isOpen={isYearOpen}
              onToggle={() => setIsYearOpen(!isYearOpen)}
              themeColor={asset?.color}
              onSelect={(translatedYear) => {
                const originalKey =
                  years.find(
                    (opt) => translateDropdownItem(opt) === translatedYear,
                  ) || years[0];
                if (originalKey) handleSelectYear(originalKey);
                setIsYearOpen(false);
              }}
            />
          </div>
        )}
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
          useVirtualization={true}
        />
      </section>

      {/* nav action bottom */}
      {!isSearchMode && (
        <section className="fixed bottom-0 right-0 left-0 py-2 px-4 border-t border-border bg-surface z-50">
          <div className="flex gap-3">
            <Button
              variant="unstyled"
              onClick={onEditClick}
              className="w-[25%] flex flex-col items-center justify-center border border-border py-1.5 rounded-md hover:bg-surface-secondary cursor-pointer"
            >
              <Pencil size={18} />
              <span className="text-sm mt-px">{t("edit")}</span>
            </Button>
            <div
              className={cn(
                "relative w-[75%] flex items-center bg-primary text-white text-sm font-medium rounded-md cursor-pointer",
                isAddMenuOpen ? "rounded-tl-none rounded-tr-none" : "",
              )}
              style={{ backgroundColor: asset?.color || undefined }}
            >
              <Button
                variant="unstyled"
                onClick={onAddTransactionClick}
                className={cn(
                  "w-full h-full px-2 truncate rounded-md hover:bg-black/10 transition-colors",
                  isAddMenuOpen
                    ? "rounded-tl-none rounded-tr-none rounded-br-none"
                    : "rounded-tr-none rounded-br-none",
                )}
              >
                {t("addTransaction")}
              </Button>

              <div className="h-full w-px bg-background" />

              <Button
                variant="unstyled"
                onClick={onAddMenuToggle}
                className={cn(
                  "w-[20%] h-full rounded-md hover:bg-black/10 transition-colors flex items-center justify-center",
                  isAddMenuOpen
                    ? "rounded-tr-none rounded-tl-none rounded-bl-none"
                    : "rounded-tl-none rounded-bl-none",
                )}
              >
                <ChevronRight
                  size={20}
                  className={cn(
                    "transition-transform",
                    isAddMenuOpen && "-rotate-90",
                  )}
                />
              </Button>

              {isAddMenuOpen && (
                <>
                  <Button
                    variant="unstyled"
                    type="button"
                    aria-label="Close add menu"
                    className="fixed inset-0 z-0 w-full h-full cursor-default focus:outline-none"
                    onClick={onAddMenuClose}
                    tabIndex={-1}
                  />
                  <div
                    className={cn(
                      "absolute w-full bottom-full py-1 left-1/2 -translate-x-1/2 z-10 border border-border rounded-md flex flex-col bg-primary text-white overflow-hidden",
                      isAddMenuOpen ? "rounded-bl-none rounded-br-none" : "",
                    )}
                    style={{ backgroundColor: asset?.color || undefined }}
                  >
                    <Button
                      variant="unstyled"
                      onClick={onAddExpenseClick}
                      className="w-full py-2 text-sm hover:bg-black/10 border-b border-border/20 font-medium"
                    >
                      {t("expense")}
                    </Button>
                    <Button
                      variant="unstyled"
                      onClick={onAddIncomeClick}
                      className="w-full py-2 text-sm hover:bg-black/10 border-b border-border/20 font-medium"
                    >
                      {t("income")}
                    </Button>
                    <Button
                      variant="unstyled"
                      onClick={onTransferClick}
                      className="w-full py-2 text-sm hover:bg-black/10 border-b border-border/20 font-medium"
                    >
                      {t("transfer")}
                    </Button>
                    <Button
                      variant="unstyled"
                      onClick={onAdjustmentClick}
                      className="w-full py-2 text-sm hover:bg-black/10 font-medium"
                    >
                      {t("adjustment")}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
