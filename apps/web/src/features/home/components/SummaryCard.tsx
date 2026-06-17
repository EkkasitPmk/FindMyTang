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
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-pulse mb-6">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 bg-gray-100 rounded"></div>
          <div className="h-20 bg-gray-100 rounded"></div>
          <div className="h-20 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-red-600 mb-6">
        Failed to load today's summary.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Today
      </h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 mb-1">Income</span>
          <span className="text-xl font-bold text-green-600">
            {formatCurrency(summary.income)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 mb-1">Expense</span>
          <span className="text-xl font-bold text-red-600">
            {formatCurrency(summary.expense)}
          </span>
        </div>
        <div className="flex flex-col border-l border-gray-100 pl-4">
          <span className="text-xs text-gray-500 mb-1">Net</span>
          <span
            className={`text-xl font-bold ${
              summary.net >= 0 ? "text-gray-900" : "text-red-600"
            }`}
          >
            {formatCurrency(summary.net)}
          </span>
        </div>
      </div>
    </div>
  );
}
