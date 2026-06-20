import { TodaySummary } from "../types/summary.type";
import { formatCurrency } from "../utils/currency.util";

interface SummaryCardProps {
  summary?: TodaySummary;
  isLoading?: boolean;
  isError?: boolean;
}

export default function SummaryCard({
  summary,
  isLoading,
  isError,
}: SummaryCardProps) {
  if (isLoading) {
    return (
      <div className="bg-surface p-6 rounded-xl border border-border shadow-sm animate-pulse mb-6">
        <div className="h-4 bg-surface-secondary rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 bg-surface-secondary rounded"></div>
          <div className="h-20 bg-surface-secondary rounded"></div>
          <div className="h-20 bg-surface-secondary rounded"></div>
        </div>
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="bg-expense-light p-6 rounded-xl border border-expense/20 text-expense mb-6">
        Failed to load today's summary.
      </div>
    );
  }

  return (
    <div className="bg-surface p-6 rounded-xl border border-border shadow-sm mb-6">
      <h2 className="text-sm font-semibold text-secondary-text uppercase tracking-wider mb-4">
        Today
      </h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-secondary-text mb-1">Income</span>
          <span className="text-xl font-bold text-income">
            {formatCurrency(summary.income)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-secondary-text mb-1">Expense</span>
          <span className="text-xl font-bold text-expense">
            {formatCurrency(summary.expense)}
          </span>
        </div>
        <div className="flex flex-col border-l border-border pl-4">
          <span className="text-xs text-secondary-text mb-1">Net</span>
          <span
            className={`text-xl font-bold ${
              summary.net >= 0 ? "text-primary-text" : "text-expense"
            }`}
          >
            {formatCurrency(summary.net)}
          </span>
        </div>
      </div>
    </div>
  );
}
