import { cn } from "@/shared/lib/utils/core.util";
import { formatAmount, formatNet } from "../helpers/calendar.helper";

interface MonthlySummaryProps {
  income: number;
  expense: number;
  transfer: number;
  adjustment: number;
  net: number;
}

export function MonthlySummary({
  income,
  expense,
  transfer,
  adjustment,
  net,
}: Readonly<MonthlySummaryProps>) {
  return (
    <section className="bg-surface border-b border-border px-4 py-2.5 flex items-center overflow-x-auto gap-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none shadow-sm">
      {/* Net Amount - Always visible first */}
      <div className="flex flex-col shrink-0">
        <span className="text-[11px] font-medium text-secondary-text uppercase tracking-wider">
          Net
        </span>
        <span
          className={cn(
            "text-[15px] font-bold",
            net >= 0 ? "text-income" : "text-expense",
          )}
        >
          {formatNet(net)}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-7 bg-border shrink-0 rounded-full" />

      {/* Income */}
      <div className="flex flex-col shrink-0">
        <span className="text-[11px] font-medium text-secondary-text uppercase tracking-wider">
          Income
        </span>
        <span className="text-sm font-semibold text-income">
          {formatAmount(income)}
        </span>
      </div>

      {/* Expense */}
      <div className="flex flex-col shrink-0">
        <span className="text-[11px] font-medium text-secondary-text uppercase tracking-wider">
          Expense
        </span>
        <span className="text-sm font-semibold text-expense">
          {formatAmount(expense)}
        </span>
      </div>

      {/* Transfer */}
      <div className="flex flex-col shrink-0">
        <span className="text-[11px] font-medium text-secondary-text uppercase tracking-wider">
          Transfer
        </span>
        <span className="text-sm font-semibold text-transfer">
          {formatAmount(transfer)}
        </span>
      </div>

      {/* Adjustment */}
      <div className="flex flex-col shrink-0">
        <span className="text-[11px] font-medium text-secondary-text uppercase tracking-wider">
          Adjustment
        </span>
        <span className="text-sm font-semibold text-info">
          {formatAmount(adjustment)}
        </span>
      </div>
    </section>
  );
}
