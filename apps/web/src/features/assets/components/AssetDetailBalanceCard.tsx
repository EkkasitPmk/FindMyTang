import { EyeOff } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Asset } from "@/shared/lib/types/asset.type";
import { cn } from "@/shared/lib/utils/core.util";
import CashFlowCard from "@/shared/components/customs/CashFlowCard";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { AssetFilterType, AssetMonthlySummary } from "../types/assets.type";
import { getNetFlowMeta } from "../helpers/asset-detail.helper";
import AssetDateRangeDropdowns from "./AssetDateRangeDropdowns";
import AssetSavingsSplitBar from "./AssetSavingsSplitBar";

const DEFAULT_ASSET_COLOR = "#2563EB";

interface AssetDetailBalanceCardProps {
  asset?: Asset;
  summary?: AssetMonthlySummary;
  selectedMonth: string;
  months: string[];
  handleSelectMonth: (month: string) => void;
  isMonthOpen: boolean;
  setIsMonthOpen: Dispatch<SetStateAction<boolean>>;
  selectedYear: string;
  years: string[];
  handleSelectYear: (year: string) => void;
  isYearOpen: boolean;
  setIsYearOpen: Dispatch<SetStateAction<boolean>>;
  translateDropdownItem: (item: string) => string;
  filterType?: AssetFilterType;
  onFilterSelect?: (type: AssetFilterType) => void;
  onEditSavings?: () => void;
}

export default function AssetDetailBalanceCard({
  asset,
  summary,
  selectedMonth,
  months,
  handleSelectMonth,
  isMonthOpen,
  setIsMonthOpen,
  selectedYear,
  years,
  handleSelectYear,
  isYearOpen,
  setIsYearOpen,
  translateDropdownItem,
  filterType = "ALL",
  onFilterSelect,
  onEditSavings,
}: Readonly<AssetDetailBalanceCardProps>) {
  const { t, locale } = useTranslation();
  const netAmount = summary?.net ?? 0;
  const {
    Icon: NetIcon,
    colorClass: netColorClass,
    formatted: formattedNetAmount,
  } = getNetFlowMeta(netAmount, locale);

  const savingsAmount = asset?.savingsAmount ?? 0;
  const isSavingsSplitActive =
    asset?.includeInSnapshot !== false && savingsAmount > 0;

  return (
    <section className="px-4 pt-3">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface py-4.5 sm:py-5 shadow-sm space-y-2.5">
        {/* Row 1: Badge (left) & Month/Year Selectors (right) */}
        <div className="flex items-center justify-between gap-2 px-4.5 sm:px-5">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold select-none shrink-0"
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
            <span className="tracking-wider uppercase">{t("balance")}</span>
          </div>

          <AssetDateRangeDropdowns
            selectedMonth={selectedMonth}
            months={months}
            handleSelectMonth={handleSelectMonth}
            isMonthOpen={isMonthOpen}
            setIsMonthOpen={setIsMonthOpen}
            selectedYear={selectedYear}
            years={years}
            handleSelectYear={handleSelectYear}
            isYearOpen={isYearOpen}
            setIsYearOpen={setIsYearOpen}
            translateDropdownItem={translateDropdownItem}
          />
        </div>

        {/* Row 2: Balance Amount */}
        <div className="flex items-baseline justify-between gap-2 px-4.5 sm:px-5 flex-wrap">
          <div className="flex items-baseline gap-1.5">
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
          {asset?.includeInSnapshot === false && (
            <span className="inline-flex items-center gap-1.5 text-xs text-secondary-text font-medium bg-surface-secondary border border-border/70 px-2.5 py-1 rounded-full self-center">
              <EyeOff size={12} className="text-secondary-text" />
              <span>{t("excludedFromSnapshotBadge")}</span>
            </span>
          )}
        </div>

        {/* Savings Split Compact Bar (Inline Pills) */}
        {isSavingsSplitActive && (
          <AssetSavingsSplitBar
            balance={asset?.balance ?? 0}
            savingsAmount={savingsAmount}
            onEditSavings={onEditSavings}
          />
        )}

        {/* Row 3: Split Cards (Income, Expense, Transfer, Adjustment) */}
        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar px-4.5 py-1 sm:px-5">
          <CashFlowCard
            type="income"
            label={t("income")}
            amount={summary?.income ?? 0}
            count={summary?.incomeCount ?? 0}
            isSelected={filterType === "INCOME"}
            onClick={() =>
              onFilterSelect?.(filterType === "INCOME" ? "ALL" : "INCOME")
            }
          />
          <CashFlowCard
            type="expense"
            label={t("expense")}
            amount={summary?.expense ?? 0}
            count={summary?.expenseCount ?? 0}
            isSelected={filterType === "EXPENSE"}
            onClick={() =>
              onFilterSelect?.(filterType === "EXPENSE" ? "ALL" : "EXPENSE")
            }
          />
          <CashFlowCard
            type="transfer"
            label={t("transfer")}
            amount={summary?.transfer ?? 0}
            count={summary?.transferCount ?? 0}
            isSelected={filterType === "TRANSFER"}
            onClick={() =>
              onFilterSelect?.(filterType === "TRANSFER" ? "ALL" : "TRANSFER")
            }
          />
          <CashFlowCard
            type="adjustment"
            label={t("adjustment")}
            amount={summary?.adjustment ?? 0}
            count={summary?.adjustmentCount ?? 0}
            isSelected={filterType === "ADJUSTMENT"}
            onClick={() =>
              onFilterSelect?.(
                filterType === "ADJUSTMENT" ? "ALL" : "ADJUSTMENT",
              )
            }
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
  );
}
