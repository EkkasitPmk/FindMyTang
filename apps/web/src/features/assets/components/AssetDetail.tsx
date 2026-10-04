import {
  Plus,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Asset } from "@/shared/lib/types/asset.type";
import { GroupedTransaction } from "@/shared/lib/types/transaction.type";
import { cn } from "@/shared/lib/utils/core.util";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import CashFlowCard from "@/shared/components/customs/CashFlowCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/animate-ui/components/radix/dropdown-menu";
import { Dispatch, SetStateAction, RefObject } from "react";
import { TransactionListContainer } from "@/features/transactions/containers/TransactionListContainer";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { TranslationKey } from "@/shared/lib/configs/translations.config";
import { Slide } from "@/shared/components/animate-ui/primitives/effects/slide";
import AssetPageSkeleton from "./AssetPageSkeleton";

const DEFAULT_ASSET_COLOR = "#2563EB";

interface AssetMonthlySummary {
  income: number;
  expense: number;
  transfer: number;
  adjustment: number;
  net: number;
  incomeCount: number;
  expenseCount: number;
  transferCount: number;
  adjustmentCount: number;
}

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
  isSearchMode,
  searchKeyword,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  translateDropdownItem,
}: Readonly<AssetDetailProps>) {
  const { t, locale } = useTranslation();
  const viewOptionsList = ["recentTransactions", "showDeletedItems"];

  const netAmount = summary?.net ?? 0;
  const totalTransactionsCount =
    (summary?.incomeCount ?? 0) +
    (summary?.expenseCount ?? 0) +
    (summary?.transferCount ?? 0) +
    (summary?.adjustmentCount ?? 0);
  let NetIcon = Minus;
  let netColorClass = "text-secondary-text";
  let formattedNetAmount = `฿ ${(0).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (netAmount > 0) {
    NetIcon = TrendingUp;
    netColorClass = "text-income";
    formattedNetAmount = `+฿ ${netAmount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (netAmount < 0) {
    NetIcon = TrendingDown;
    netColorClass = "text-expense";
    formattedNetAmount = `-฿ ${Math.abs(netAmount).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  if (isLoading) return <AssetPageSkeleton />;

  return (
    <div className="relative flex flex-col h-full space-y-3">
      {!isSearchMode && (
        <>
          {/* Top Balance Card */}
          <section className="px-4 pt-3">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface py-4.5 sm:py-5 shadow-sm space-y-2.5">
              {/* Row 1: Badge (left) & Month/Year Selectors (right) */}
              <div className="flex items-center justify-between gap-2 px-4.5 sm:px-5">
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold select-none"
                  style={{
                    backgroundColor: `${asset?.color || DEFAULT_ASSET_COLOR}1A`,
                    color: asset?.color || DEFAULT_ASSET_COLOR,
                  }}
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{
                      backgroundColor: asset?.color || DEFAULT_ASSET_COLOR,
                    }}
                  />
                  <span className="tracking-wider uppercase">
                    {t("balance")}
                  </span>
                </div>

                {/* Month & Year Dropdown Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Month Dropdown */}
                  <DropdownMenu
                    open={isMonthOpen}
                    onOpenChange={setIsMonthOpen}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="unstyled"
                        hoverScale={1}
                        tapScale={1}
                        type="button"
                        className={cn(
                          "flex items-center justify-between gap-1.5 h-8 px-2.5 rounded-lg text-xs sm:text-sm font-medium border border-border/80 bg-surface transition-colors cursor-pointer outline-none min-w-29 sm:min-w-31 w-auto",
                          isMonthOpen
                            ? "border-primary text-primary"
                            : "text-secondary-text hover:text-primary-text hover:bg-surface-secondary",
                        )}
                      >
                        <span className="whitespace-nowrap">
                          {translateDropdownItem(selected)}
                        </span>
                        <ChevronDown
                          size={14}
                          className={cn(
                            "shrink-0 transition-transform duration-200 text-secondary-text",
                            isMonthOpen && "-rotate-180 text-primary",
                          )}
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      sideOffset={4}
                      transition={{ duration: 0.12, ease: "easeOut" }}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="w-(--radix-dropdown-menu-trigger-width) min-w-29 sm:min-w-31 max-h-fit overflow-y-auto p-1 rounded-xl shadow-lg border border-border bg-surface z-50"
                    >
                      <DropdownMenuGroup>
                        {months.map((month) => {
                          const isSelected = month === selected;
                          return (
                            <DropdownMenuItem
                              key={month}
                              onSelect={() => handleSelect(month)}
                              className={cn(
                                "w-full justify-start px-2.5 py-1.5 text-xs sm:text-sm cursor-pointer rounded-lg my-0.5",
                                isSelected
                                  ? "text-primary font-semibold bg-primary-light/60"
                                  : "text-primary-text",
                              )}
                            >
                              <span className="whitespace-nowrap">
                                {translateDropdownItem(month)}
                              </span>
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Year Dropdown */}
                  <DropdownMenu open={isYearOpen} onOpenChange={setIsYearOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="unstyled"
                        hoverScale={1}
                        tapScale={1}
                        type="button"
                        className={cn(
                          "flex items-center justify-between gap-1.5 h-8 px-2.5 rounded-lg text-xs sm:text-sm font-medium border border-border/80 bg-surface transition-colors cursor-pointer outline-none min-w-19 sm:min-w-21 w-auto",
                          isYearOpen
                            ? "border-primary text-primary"
                            : "text-secondary-text hover:text-primary-text hover:bg-surface-secondary",
                        )}
                      >
                        <span className="whitespace-nowrap">
                          {translateDropdownItem(selectedYear)}
                        </span>
                        <ChevronDown
                          size={14}
                          className={cn(
                            "shrink-0 transition-transform duration-200 text-secondary-text",
                            isYearOpen && "-rotate-180 text-primary",
                          )}
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      sideOffset={4}
                      transition={{ duration: 0.12, ease: "easeOut" }}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="w-(--radix-dropdown-menu-trigger-width) min-w-19 sm:min-w-21 max-h-60 overflow-y-auto p-1 rounded-xl shadow-lg border border-border bg-surface z-50"
                    >
                      <DropdownMenuGroup>
                        {years.map((year) => {
                          const isSelected = year === selectedYear;
                          return (
                            <DropdownMenuItem
                              key={year}
                              onSelect={() => handleSelectYear(year)}
                              className={cn(
                                "w-full justify-start px-2.5 py-1.5 text-xs sm:text-sm cursor-pointer rounded-lg my-0.5",
                                isSelected
                                  ? "text-primary font-semibold bg-primary-light/60"
                                  : "text-primary-text",
                              )}
                            >
                              <span className="whitespace-nowrap">
                                {translateDropdownItem(year)}
                              </span>
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Row 2: Balance Amount */}
              <div className="flex items-baseline gap-1.5 px-4.5 sm:px-5">
                <span className="text-2xl font-bold opacity-70 text-secondary-text">
                  ฿
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-text tabular-nums">
                  {(asset?.balance ?? 0).toLocaleString(locale, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              {/* Row 3: Split Cards (Income, Expense, Transfer, Adjustment) */}
              <div className="flex gap-2.5 overflow-x-auto hide-scrollbar px-4.5 sm:px-5">
                <CashFlowCard
                  type="income"
                  label={t("income")}
                  amount={summary?.income ?? 0}
                  count={summary?.incomeCount ?? 0}
                />
                <CashFlowCard
                  type="expense"
                  label={t("expense")}
                  amount={summary?.expense ?? 0}
                  count={summary?.expenseCount ?? 0}
                />
                <CashFlowCard
                  type="transfer"
                  label={t("transfer")}
                  amount={summary?.transfer ?? 0}
                  count={summary?.transferCount ?? 0}
                />
                <CashFlowCard
                  type="adjustment"
                  label={t("adjustment")}
                  amount={summary?.adjustment ?? 0}
                  count={summary?.adjustmentCount ?? 0}
                />
              </div>

              {/* Row 4: Net Cash Flow Footer */}
              <div className="pt-2.5 px-4.5 sm:px-5 border-t border-border/50 flex items-center justify-between text-xs">
                <span className="text-secondary-text">{t("netCashFlow")}</span>
                <div className="flex items-center gap-1 font-medium">
                  <span
                    className={cn(
                      "flex items-center gap-1 font-semibold tabular-nums",
                      netColorClass,
                    )}
                  >
                    <NetIcon className="size-3.5" />
                    {formattedNetAmount}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Inline View Option Dropdown ("Recent Transactions ˅") & Total count */}
          <section className="flex items-center justify-between px-4">
            <DropdownMenu
              open={isViewOptionOpen}
              onOpenChange={onViewOptionToggle}
            >
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  ref={viewOptionRef as unknown as React.Ref<HTMLButtonElement>}
                  className="flex items-center gap-1.5 text-base sm:text-lg font-bold text-primary-text hover:text-primary transition-colors cursor-pointer outline-none select-none group"
                >
                  <span>{t(viewOption as TranslationKey)}</span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "transition-transform duration-200 text-secondary-text group-hover:text-primary",
                      isViewOptionOpen && "-rotate-180",
                    )}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={6}
                className="p-1 rounded-xl shadow-lg border border-border bg-surface text-primary-text z-50 min-w-44"
              >
                <DropdownMenuGroup>
                  {viewOptionsList.map((opt) => {
                    const isSelected = opt === viewOption;
                    return (
                      <DropdownMenuItem
                        key={opt}
                        onSelect={() => onViewOptionSelect(opt)}
                        className={cn(
                          "w-full justify-between px-2.5 py-1.5 text-sm cursor-pointer rounded-lg my-0.5",
                          isSelected
                            ? "text-primary font-semibold bg-primary-light/60"
                            : "text-primary-text",
                        )}
                      >
                        {t(opt as TranslationKey)}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {isLoadingTransactions ? (
              <span className="h-4 w-14 rounded bg-surface-secondary animate-pulse" />
            ) : (
              <span className="text-xs sm:text-sm font-medium text-secondary-text tabular-nums">
                {totalTransactionsCount} {t("items")}
              </span>
            )}
          </section>
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

      {/* nav action bottom */}
      {!isSearchMode && (
        <Slide
          asChild
          direction="up"
          offset={96}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <section className="absolute bottom-4 left-3 right-3 z-50 rounded-xl border border-border/70 bg-surface/95 px-1.5 py-1.5 shadow-lg backdrop-blur-xl">
            <div
              className={cn(
                "relative flex w-full items-center rounded-lg bg-primary text-sm font-medium text-white shadow-sm transition-all",
                isAddMenuOpen ? "rounded-tl-none rounded-tr-none" : "",
              )}
              style={{ backgroundColor: asset?.color || undefined }}
            >
              <Button
                variant="unstyled"
                onClick={onAddTransactionClick}
                className={cn(
                  "flex min-h-10.5 flex-1 items-center justify-center gap-1.5 px-4 font-semibold text-white transition-colors hover:bg-black/10 cursor-pointer",
                  isAddMenuOpen
                    ? "rounded-tl-none rounded-tr-none rounded-br-none"
                    : "rounded-tr-none rounded-br-none",
                )}
              >
                <Plus size={18} />
                <span>{t("addTransaction")}</span>
              </Button>

              <div className="min-h-10.5 w-px bg-white/20" />

              <Button
                variant="unstyled"
                onClick={onAddMenuToggle}
                aria-label="Toggle transaction types menu"
                className={cn(
                  "flex min-h-10.5 w-12 items-center justify-center text-white transition-colors hover:bg-black/10 cursor-pointer",
                  isAddMenuOpen
                    ? "rounded-tr-none rounded-tl-none rounded-bl-none"
                    : "rounded-tl-none rounded-bl-none",
                )}
              >
                <ChevronUp
                  size={18}
                  className={cn(
                    "transition-transform duration-200",
                    isAddMenuOpen && "rotate-180",
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
                      "absolute bottom-full left-1/2 z-10 flex w-full -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-primary py-1 text-white shadow-xl",
                      isAddMenuOpen ? "rounded-bl-none rounded-br-none" : "",
                    )}
                    style={{ backgroundColor: asset?.color || undefined }}
                  >
                    <Button
                      variant="unstyled"
                      onClick={onAddExpenseClick}
                      className="w-full py-2.5 text-sm hover:bg-black/10 border-b border-border/20 font-medium"
                    >
                      {t("expense")}
                    </Button>
                    <Button
                      variant="unstyled"
                      onClick={onAddIncomeClick}
                      className="w-full py-2.5 text-sm hover:bg-black/10 border-b border-border/20 font-medium"
                    >
                      {t("income")}
                    </Button>
                    <Button
                      variant="unstyled"
                      onClick={onTransferClick}
                      className="w-full py-2.5 text-sm hover:bg-black/10 border-b border-border/20 font-medium"
                    >
                      {t("transfer")}
                    </Button>
                    <Button
                      variant="unstyled"
                      onClick={onAdjustmentClick}
                      className="w-full py-2.5 text-sm hover:bg-black/10 font-medium"
                    >
                      {t("adjustment")}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </section>
        </Slide>
      )}
    </div>
  );
}
