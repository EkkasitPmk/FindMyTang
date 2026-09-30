import { DrilldownSummary as IDrilldownSummary } from "../schemas/analytics.response.schema";
import { formatCurrency } from "@/shared/lib/utils/currency.util";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { format } from "date-fns";
import { th, enUS } from "date-fns/locale";

interface DrilldownSummaryProps {
  summary: IDrilldownSummary;
  color: string;
  month?: number;
  year?: number;
}

export const DrilldownSummary = ({
  summary,
  color,
  month,
  year,
}: DrilldownSummaryProps) => {
  const { t, currentLanguage } = useTranslation();
  const dateLocale = currentLanguage === "th" ? th : enUS;
  const isUp = summary.percentageChange > 0;

  const now = new Date();
  const isCurrentMonth =
    (!month || month === now.getMonth() + 1) &&
    (!year || year === now.getFullYear());

  const currentLabel = isCurrentMonth
    ? t("totalThisMonth")
    : format(
        new Date(year ?? now.getFullYear(), (month ?? 1) - 1, 1),
        "MMMM yyyy",
        { locale: dateLocale },
      );

  const currentBarLabel = isCurrentMonth
    ? t("thisMonth")
    : format(new Date(year ?? now.getFullYear(), (month ?? 1) - 1, 1), "MMM", {
        locale: dateLocale,
      });

  const prevMonthDate = new Date(
    year ?? now.getFullYear(),
    (month ?? 1) - 2,
    1,
  );
  const prevBarLabel = isCurrentMonth
    ? t("lastMonth")
    : format(prevMonthDate, "MMM", { locale: dateLocale });

  return (
    <div className="bg-surface rounded-xl border border-border px-4 py-3">
      <div className="text-sm text-secondary-text font-medium capitalize">
        {currentLabel}
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
          title={`${currentBarLabel}: ${formatCurrency(summary.currentMonth)}`}
        />
        <div
          className="h-full bg-surface-secondary rounded-md transition-all"
          style={{
            width: `${Math.max(10, Math.min(100, (summary.previousMonth / Math.max(summary.currentMonth, summary.previousMonth)) * 100))}%`,
          }}
          title={`${prevBarLabel}: ${formatCurrency(summary.previousMonth)}`}
        />
      </div>
      <div className="flex justify-between text-[0.6875rem] text-secondary-text px-1 mt-1">
        <span>{currentBarLabel}</span>
        <span>
          {prevBarLabel}: {formatCurrency(summary.previousMonth)}
        </span>
      </div>
    </div>
  );
};
