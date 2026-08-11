"use client";
import {
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  Minus,
  SlidersHorizontal,
  Wallet,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils/core.util";

interface FinancialSnapshotCardProps {
  netWorth: number;
  income: number;
  expense: number;
  transfer: number;
  adjustment: number;
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
  transfer,
  adjustment,
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
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-4.5 sm:p-5 shadow-sm">
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
        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton
              key={index}
              className="h-13.5 w-[42%] shrink-0 rounded-lg"
            />
          ))}
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
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-4.5 sm:p-5 shadow-sm flex flex-col gap-3">
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
        <div className="flex items-center gap-2 pt-2 border-t border-border/50 text-xs text-secondary-text">
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
          initial={false}
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
        initial={false}
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
    type: "income" | "expense" | "transfer" | "adjustment",
    amount: number,
  ) => {
    const styles = {
      income: {
        Icon: ArrowUpRight,
        colorClass: "text-income",
        bgBorderClass: "bg-income/8 border-income/15",
        prefix: "+฿ ",
      },
      expense: {
        Icon: ArrowDownRight,
        colorClass: "text-expense",
        bgBorderClass: "bg-expense/8 border-expense/15",
        prefix: "-฿ ",
      },
      transfer: {
        Icon: ArrowLeftRight,
        colorClass: "text-transfer",
        bgBorderClass: "bg-transfer/8 border-transfer/15",
        prefix: "฿ ",
      },
      adjustment: {
        Icon: SlidersHorizontal,
        colorClass: "text-info",
        bgBorderClass: "bg-info/8 border-info/15",
        prefix: "฿ ",
      },
    }[type];
    const { Icon, colorClass, bgBorderClass, prefix } = styles;

    return (
      <div
        className={cn(
          "flex w-[42%] shrink-0 flex-col rounded-lg border p-2.5",
          bgBorderClass,
        )}
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
    const isPositive = netChange > 0;
    const isNegative = netChange < 0;
    let Icon = Minus;
    let colorClass = "text-secondary-text";
    let prefix = "฿ ";

    if (isPositive) {
      Icon = TrendingUp;
      colorClass = "text-income";
      prefix = "+฿ ";
    } else if (isNegative) {
      Icon = TrendingDown;
      colorClass = "text-expense";
      prefix = "-฿ ";
    }

    const displayAmount = Math.abs(netChange);

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
    <section className="relative overflow-hidden rounded-xl border border-border bg-surface py-4.5 sm:py-5 shadow-sm transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 relative z-10 px-4.5">
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
      <div className="relative z-10 mb-3 px-4.5">
        <span className="text-xs font-medium text-secondary-text block">
          {t("balance")}
        </span>
        <AnimatePresence mode="wait">{renderNetWorthAmount()}</AnimatePresence>
      </div>

      {/* Cash Flow Split Cards */}
      <div className="flex gap-2.5 overflow-x-auto hide-scrollbar relative z-10 px-4.5">
        {renderCashFlowCard(t("income"), "income", income)}
        {renderCashFlowCard(t("expense"), "expense", expense)}
        {renderCashFlowCard(t("transfer"), "transfer", transfer)}
        {renderCashFlowCard(t("adjustment"), "adjustment", adjustment)}
      </div>

      {/* Monthly Net Change Footer Pill */}
      <div className="mt-3 pt-2.5 px-4.5 border-t border-border/50 flex items-center justify-between text-xs relative z-10">
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
