import {
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils/core.util";

interface FinancialSnapshotCardProps {
  netWorth: number;
  income: number;
  expense: number;
  netChange: number;
  hasAssets: boolean;
  isPrivate: boolean;
  onTogglePrivacy: () => void;
  isLoading: boolean;
}

export default function FinancialSnapshotCard({
  netWorth,
  income,
  expense,
  netChange,
  hasAssets,
  isPrivate,
  onTogglePrivacy,
  isLoading,
}: Readonly<FinancialSnapshotCardProps>) {
  const { t, locale } = useTranslation();

  const formatCurrency = (val: number) => {
    return val.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-4.5 sm:p-5 shadow-xs">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="size-7 rounded-lg" />
        </div>

        {/* Net Worth Section Skeleton */}
        <div className="mb-2">
          <Skeleton className="h-3 w-16 mb-1.5" />
          <Skeleton className="h-9 w-44" />
        </div>

        {/* Cash Flow Split Cards Skeleton */}
        <div className="grid grid-cols-2 gap-2.5">
          <Skeleton className="h-13.5 rounded-lg" />
          <Skeleton className="h-13.5 rounded-lg" />
        </div>

        {/* Monthly Net Change Footer Pill Skeleton */}
        <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }

  if (!hasAssets) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-4.5 sm:p-5 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text flex items-center gap-1.5">
            <Wallet className="size-3.5 text-primary" />
            {t("financialSnapshot")}
          </span>
        </div>
        <div>
          <span className="text-xs font-medium text-secondary-text block">
            {t("balance")}
          </span>
          <span className="text-3xl font-bold tracking-tight text-primary-text">
            ฿ 0.00
          </span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-border/50 text-xs text-secondary-text">
          <span className="text-primary font-medium">
            {t("startRecordingTransactions")}
          </span>
        </div>
      </div>
    );
  }

  const renderNetWorthAmount = () => {
    if (isPrivate) {
      return (
        <motion.div
          key="private"
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 2 }}
          transition={{ duration: 0.15 }}
          className="text-3xl flex items-center gap-1 font-bold tracking-tight text-primary-text select-none"
        >
          ฿<span className="h-6 flex">******</span>
        </motion.div>
      );
    }

    return (
      <motion.div
        key="visible"
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -2 }}
        transition={{ duration: 0.15 }}
        className="text-3xl font-bold tracking-tight text-primary-text tabular-nums"
      >
        ฿ {formatCurrency(netWorth)}
      </motion.div>
    );
  };

  const renderCashFlowCard = (
    label: string,
    type: "income" | "expense",
    amount: number,
  ) => {
    const isIncome = type === "income";
    const Icon = isIncome ? ArrowUpRight : ArrowDownRight;
    const colorClass = isIncome ? "text-income" : "text-expense";
    const bgBorderClass = isIncome
      ? "bg-income/8 border-income/15"
      : "bg-expense/8 border-expense/15";
    const prefix = isIncome ? "+฿ " : "-฿ ";

    return (
      <div
        className={cn("flex flex-col p-2.5 rounded-lg border", bgBorderClass)}
      >
        <div
          className={cn(
            "flex items-center gap-1 text-[11px] font-medium",
            colorClass,
          )}
        >
          <Icon className="size-3.5 shrink-0" />
          <span>{label}</span>
        </div>
        <span
          className={cn(
            "text-sm font-semibold tabular-nums truncate",
            colorClass,
            isPrivate && "flex items-center gap-0.5",
          )}
        >
          {isPrivate ? (
            <>
              ฿<span className="h-4 flex">****</span>
            </>
          ) : (
            `${prefix}${formatCurrency(amount)}`
          )}
        </span>
      </div>
    );
  };

  const renderNetChangeBadge = () => {
    const isPositive = netChange >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? "text-income" : "text-expense";
    const prefix = isPositive ? "+฿ " : "-฿ ";
    const displayAmount = isPositive ? netChange : Math.abs(netChange);

    return (
      <span
        className={cn(
          "flex items-center gap-1 font-semibold tabular-nums",
          colorClass,
          isPrivate && "gap-0.5",
        )}
      >
        <Icon className="size-3.5" />
        {isPrivate ? (
          <>
            ฿<span className="h-3 flex">****</span>
          </>
        ) : (
          `${prefix}${formatCurrency(displayAmount)}`
        )}
      </span>
    );
  };

  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-surface p-4.5 sm:p-5 shadow-xs transition-all duration-200">
      {/* Background Ambient Tint */}
      <div className="absolute -top-12 -right-12 size-36 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-2 relative z-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text flex items-center gap-1.5">
          <Wallet className="size-3.5 text-primary" />
          {t("financialSnapshot")}
        </span>
        <Button
          variant="unstyled"
          type="button"
          onClick={onTogglePrivacy}
          aria-label={isPrivate ? "Show balance" : "Hide balance"}
          className="p-1.5 rounded-lg text-secondary-text hover:text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
        >
          {isPrivate ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </Button>
      </div>

      {/* Net Worth Section */}
      <div className="relative z-10 mb-3">
        <span className="text-xs font-medium text-secondary-text block">
          {t("balance")}
        </span>
        <AnimatePresence mode="wait">{renderNetWorthAmount()}</AnimatePresence>
      </div>

      {/* Cash Flow Split Cards (Income vs Expense) */}
      <div className="grid grid-cols-2 gap-2.5 relative z-10">
        {renderCashFlowCard(t("income"), "income", income)}
        {renderCashFlowCard(t("expense"), "expense", expense)}
      </div>

      {/* Monthly Net Change Footer Pill */}
      <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between text-xs relative z-10">
        <span className="text-secondary-text">
          {t("netCashFlow")} ({t("thisMonth")})
        </span>
        <div className="flex items-center gap-1 font-medium">
          {renderNetChangeBadge()}
        </div>
      </div>
    </section>
  );
}
