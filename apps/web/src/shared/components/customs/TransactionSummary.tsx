import { cn } from "@/shared/lib/utils/core.util";
import { formatAmount, formatNet } from "@/shared/lib/utils/currency.util";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

export interface TransactionSummaryProps {
  income: number;
  expense: number;
  transfer: number;
  adjustment: number;
  net: number;
  className?: string;
}

export function TransactionSummary({
  income,
  expense,
  transfer,
  adjustment,
  net,
  className,
}: Readonly<TransactionSummaryProps>) {
  const { t, locale } = useTranslation();

  return (
    <section
      className={cn(
        "bg-surface border-b border-border px-4 py-2 flex items-center overflow-x-auto hide-scrollbar gap-4 shadow-sm",
        className,
      )}
    >
      {/* Net Amount - Always visible first */}
      <div className="flex flex-col shrink-0">
        <span className="text-[11px] font-medium text-secondary-text uppercase tracking-wider">
          {t("net")}
        </span>
        <span
          className={cn(
            "text-[15px] font-bold",
            net >= 0 ? "text-income" : "text-expense",
          )}
        >
          {formatNet(net, locale)}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-7 bg-border shrink-0 rounded-full" />

      {/* Income */}
      <div className="flex flex-col shrink-0">
        <span className="text-[11px] font-medium text-secondary-text uppercase tracking-wider">
          {t("income")}
        </span>
        <span className="text-sm font-semibold text-income">
          {formatAmount(income, locale)}
        </span>
      </div>

      {/* Expense */}
      <div className="flex flex-col shrink-0">
        <span className="text-[11px] font-medium text-secondary-text uppercase tracking-wider">
          {t("expense")}
        </span>
        <span className="text-sm font-semibold text-expense">
          {formatAmount(expense, locale)}
        </span>
      </div>

      {/* Transfer */}
      <div className="flex flex-col shrink-0">
        <span className="text-[11px] font-medium text-secondary-text uppercase tracking-wider">
          {t("transfer")}
        </span>
        <span className="text-sm font-semibold text-transfer">
          {formatAmount(transfer, locale)}
        </span>
      </div>

      {/* Adjustment */}
      <div className="flex flex-col shrink-0">
        <span className="text-[11px] font-medium text-secondary-text uppercase tracking-wider">
          {t("adjustment")}
        </span>
        <span className="text-sm font-semibold text-info">
          {formatAmount(adjustment, locale)}
        </span>
      </div>
    </section>
  );
}
