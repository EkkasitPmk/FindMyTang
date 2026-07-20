import { DrilldownSummary as IDrilldownSummary } from "../types/analytics.type";
import { formatCurrency } from "@/shared/lib/utils/currency.util";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

interface DrilldownSummaryProps {
  summary: IDrilldownSummary;
  color: string;
}

export const DrilldownSummary = ({ summary, color }: DrilldownSummaryProps) => {
  const { t } = useTranslation();
  const isUp = summary.percentageChange > 0;

  return (
    <div className="bg-surface rounded-xl border px-4 py-3">
      <div className="text-sm text-secondary-text font-medium">
        {t("totalThisMonth")}
      </div>
      <div className="text-3xl font-bold" style={{ color }}>
        {formatCurrency(summary.currentMonth)}
      </div>
      <div className="text-sm text-secondary-text">
        {summary.percentageOfTotal.toFixed(1)}% {t("ofTotal")}
      </div>

      <div
        className={`inline-flex my-2 items-center px-2 py-1 rounded-md text-xs font-medium ${isUp ? "bg-expense-light text-expense" : "bg-income-light text-income"}`}
      >
        {isUp ? "↑" : "↓"} {Math.abs(summary.percentageChange).toFixed(1)}%{" "}
        {t("fromLastMonth")}
      </div>

      <div className="flex h-6 w-full gap-1">
        <div
          className="h-full rounded-md transition-all"
          style={{
            backgroundColor: color,
            width: `${Math.max(10, Math.min(100, (summary.currentMonth / Math.max(summary.currentMonth, summary.previousMonth)) * 100))}%`,
          }}
          title={`${t("thisMonth")}: ${formatCurrency(summary.currentMonth)}`}
        />
        <div
          className="h-full bg-surface-secondary rounded-md transition-all"
          style={{
            width: `${Math.max(10, Math.min(100, (summary.previousMonth / Math.max(summary.currentMonth, summary.previousMonth)) * 100))}%`,
          }}
          title={`${t("lastMonth")}: ${formatCurrency(summary.previousMonth)}`}
        />
      </div>
      <div className="flex justify-between text-[11px] text-secondary-text px-1 mt-1">
        <span>{t("thisMonth")}</span>
        <span>
          {t("lastMonth")}: {formatCurrency(summary.previousMonth)}
        </span>
      </div>
    </div>
  );
};
