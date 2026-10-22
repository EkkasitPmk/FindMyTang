"use client";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { RecurringSummaryMetrics } from "@/shared/lib/types/recurring.type";
import { CalendarClock, Calendar, Coins } from "lucide-react";

interface RecurringSummaryCardProps {
  metrics: RecurringSummaryMetrics;
}

export default function RecurringSummaryCard({
  metrics,
}: Readonly<RecurringSummaryCardProps>) {
  const { t, locale } = useTranslation();

  const formatCurrency = (val: number) => {
    return val.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const dailyAmount = metrics.totalMonthly > 0 ? metrics.totalMonthly / 30 : 0;

  const activeText = t("recurringActiveCount").replace(
    "{count}",
    String(metrics.activeCount),
  );

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs space-y-3">
      {/* Header: Title + Active Badge */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <CalendarClock className="size-4" />
            </div>
            <h2 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
              {t("recurringSummaryTitle")}
            </h2>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 whitespace-nowrap ${
              metrics.activeCount > 0
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {metrics.activeCount > 0 && (
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            )}
            <span className="whitespace-nowrap">{activeText}</span>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {t("recurringSummarySubtitle")}
        </p>
      </div>

      {/* Main Monthly Hero Stat */}
      <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {t("recurringTotalMonthly")}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium whitespace-nowrap">
            {t("recurringPrimaryCycle")}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5 mt-1.5">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            ฿{formatCurrency(metrics.totalMonthly)}
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            {t("recurringPerMonth")}
          </span>
        </div>
      </div>

      {/* Sub-metrics: Yearly Projection & Daily Average */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl border border-border/50 bg-background/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium">
              {t("recurringTotalYearly")}
            </span>
            <Calendar className="size-3.5 opacity-60 shrink-0" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-sm sm:text-base font-bold text-foreground">
              ฿{formatCurrency(metrics.totalYearly)}
            </span>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              {t("recurringPerYear")}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl border border-border/50 bg-background/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium">
              {t("recurringDailyAverage")}
            </span>
            <Coins className="size-3.5 opacity-60 shrink-0" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-sm sm:text-base font-bold text-foreground">
              ฿{formatCurrency(dailyAmount)}
            </span>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              {t("recurringPerDay")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
