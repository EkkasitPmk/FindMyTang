import { ArrowUp, ArrowDown } from "lucide-react";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import { useThisMonthSummary } from "../hooks/summary.hook";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

export default function FinancialSnapshotContainer() {
  const mounted = useMounted();
  const { t, locale } = useTranslation();

  const { data: assets, isPending: isAssetsPending } = useAssets();
  const { data: summary, isPending: isSummaryPending } = useThisMonthSummary();

  // ponytail: The backend now provides totalNetWorth directly, avoiding frontend calculations.
  const netWorth = summary?.totalNetWorth || 0;
  const netChange = summary?.net || 0;

  const isLoading = !mounted || isAssetsPending || isSummaryPending;

  if (isLoading) {
    return (
      <div className="flex flex-col px-3 py-4 bg-surface rounded-md border border-border gap-2 min-h-27.5 justify-center">
        <span className="text-xs font-medium uppercase tracking-widest text-secondary-text">
          {t("financialSnapshot")}
        </span>
        <Skeleton className="h-8 w-48 mb-1" />
        <Skeleton className="h-5 w-40" />
      </div>
    );
  }

  const hasAssets = assets && assets.length > 0;

  if (!hasAssets) {
    return (
      <div className="flex flex-col px-3 py-4 bg-surface rounded-md border border-border gap-2">
        <span className="text-xs font-medium uppercase tracking-widest text-secondary-text">
          {t("financialSnapshot")}
        </span>
        <span className="text-3xl font-bold">฿ 0</span>
        <div className="flex items-center gap-1">
          <span className="text-sm text-primary font-medium">
            {t("startRecordingTransactions")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col px-3 py-4 bg-surface rounded-md border border-border gap-2">
      <span className="text-xs font-medium uppercase tracking-widest text-secondary-text">
        {t("financialSnapshot")}
      </span>
      <span className="text-3xl font-bold text-primary-text">
        ฿{" "}
        {netWorth.toLocaleString(locale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
      <div className="flex items-center gap-1">
        {netChange >= 0 ? (
          <>
            <ArrowUp className="text-income" size={16} />
            <span className="text-sm text-income font-medium">
              +
              {netChange.toLocaleString(locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {t("thisMonth")}
            </span>
          </>
        ) : (
          <>
            <ArrowDown className="text-expense" size={16} />
            <span className="text-sm text-expense font-medium">
              {Math.abs(netChange).toLocaleString(locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {t("thisMonth")}
            </span>
          </>
        )}
      </div>
    </section>
  );
}
