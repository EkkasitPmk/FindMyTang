import { MonthlyTrendItem } from "../schemas/analytics.response.schema";
import { formatCurrency } from "@/shared/lib/utils/currency.util";
import { format } from "date-fns";
import { th, enUS } from "date-fns/locale";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

interface MonthlyTrendsTableProps {
  data: MonthlyTrendItem[];
  year: number;
}

export const MonthlyTrendsTable = ({ data, year }: MonthlyTrendsTableProps) => {
  const { t, currentLanguage } = useTranslation();
  const dateLocale = currentLanguage === "th" ? th : enUS;

  const validData = [...data].reverse();

  if (validData.length === 0) return null;

  return (
    <div className="bg-transparent sm:bg-surface sm:rounded-xl sm:border sm:overflow-hidden">
      {/* Desktop Header */}
      <div className="hidden sm:grid grid-cols-6 gap-2 p-3 bg-surface-secondary border-b text-xs font-semibold text-secondary-text">
        <div>{t("monthLabel")}</div>
        <div className="text-right text-income">{t("income")}</div>
        <div className="text-right text-expense">{t("expense")}</div>
        <div className="text-right text-(--semantic-transfer)">
          {t("transfer")}
        </div>
        <div className="text-right text-(--semantic-highlight)">
          {t("adjustment")}
        </div>
        <div className="text-right">{t("netFlow")}</div>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-18 sm:gap-0 sm:divide-y sm:divide-border">
        {validData.map((item) => (
          <div
            key={item.month}
            className="bg-surface border border-border rounded-xl sm:border-0 sm:rounded-none sm:bg-transparent"
          >
            {/* Mobile View */}
            <div className="sm:hidden p-3.5 flex flex-col gap-3 h-fit">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="font-semibold text-sm">
                  {format(new Date(year, item.month - 1), "MMMM", {
                    locale: dateLocale,
                  })}
                </span>
                <span
                  className={`font-bold ${item.net >= 0 ? "text-primary" : "text-expense"}`}
                >
                  {item.net > 0 ? "+" : ""}
                  {formatCurrency(item.net)}
                </span>
              </div>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-secondary-text">{t("income")}</span>
                  <span className="text-income font-medium">
                    {formatCurrency(item.income)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary-text">{t("expense")}</span>
                  <span className="text-expense font-medium">
                    {formatCurrency(item.expense)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary-text">{t("transfer")}</span>
                  <span className="text-(--semantic-transfer) font-medium">
                    {formatCurrency(item.transfer || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary-text">{t("adjustment")}</span>
                  <span className="text-(--semantic-highlight) font-medium">
                    {formatCurrency(item.adjust || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden sm:grid grid-cols-6 gap-2 p-3 text-[13px] items-center hover:bg-surface-secondary/30 transition-colors">
              <div className="font-medium">
                {format(new Date(year, item.month - 1), "MMM yy", {
                  locale: dateLocale,
                })}
              </div>
              <div className="text-right">{formatCurrency(item.income)}</div>
              <div className="text-right">{formatCurrency(item.expense)}</div>
              <div className="text-right">
                {formatCurrency(item.transfer || 0)}
              </div>
              <div className="text-right">
                {formatCurrency(item.adjust || 0)}
              </div>
              <div
                className={`text-right font-semibold ${item.net >= 0 ? "text-primary" : "text-expense"}`}
              >
                {item.net > 0 ? "+" : ""}
                {formatCurrency(item.net)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
