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
  isSelected?: boolean;
  onClick?: () => void;
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

const ACTIVE_STYLES = {
  income: "bg-income/18 border-income ring-2 ring-income/50 shadow-xs",
  expense: "bg-expense/18 border-expense ring-2 ring-expense/50 shadow-xs",
  transfer: "bg-transfer/18 border-transfer ring-2 ring-transfer/50 shadow-xs",
  adjustment: "bg-info/18 border-info ring-2 ring-info/50 shadow-xs",
} as const;

export default function CashFlowCard({
  type,
  label,
  amount,
  count,
  isPrivate,
  className,
  isSelected = false,
  onClick,
}: Readonly<CashFlowCardProps>) {
  const { t, locale } = useTranslation();
  const { Icon, colorClass, bgBorderClass, prefix } = FLOW_STYLES[type];
  const isInteractive = Boolean(onClick);

  const formatCurrency = (val: number) => {
    return val.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div
      {...(isInteractive && {
        role: "button",
        tabIndex: 0,
        "aria-pressed": isSelected,
        onClick,
        onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
          }
        },
      })}
      className={cn(
        "flex w-[42%] shrink-0 flex-col rounded-lg border p-2.5 transition-all select-none outline-none",
        isSelected ? ACTIVE_STYLES[type] : bgBorderClass,
        isInteractive &&
          "cursor-pointer hover:brightness-95 active:scale-[0.98]",
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
