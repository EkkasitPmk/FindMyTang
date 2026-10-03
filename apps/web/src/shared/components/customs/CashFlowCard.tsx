import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/shared/lib/utils/core.util";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

export interface CashFlowCardProps {
  type: "income" | "expense" | "transfer" | "adjustment";
  label: string;
  amount: number;
  count?: number;
  isPrivate?: boolean;
  className?: string;
}

const FLOW_STYLES = {
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
} as const;

export default function CashFlowCard({
  type,
  label,
  amount,
  count,
  isPrivate,
  className,
}: Readonly<CashFlowCardProps>) {
  const { t, locale } = useTranslation();
  const { Icon, colorClass, bgBorderClass, prefix } = FLOW_STYLES[type];

  const formatCurrency = (val: number) => {
    return val.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div
      className={cn(
        "flex w-[42%] shrink-0 flex-col rounded-lg border p-2.5",
        bgBorderClass,
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1 text-[0.6875rem] font-medium",
          colorClass,
        )}
      >
        <Icon className="size-3.5 shrink-0" />
        <span className="truncate">{label}</span>
      </div>
      <span
        className={cn(
          "text-sm font-semibold tabular-nums truncate mt-0.5",
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
      {count !== undefined && (
        <span className="text-[0.6875rem] text-secondary-text truncate">
          {count} {t("items")}
        </span>
      )}
    </div>
  );
}
