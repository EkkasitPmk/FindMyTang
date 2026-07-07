import { ArrowUp, ArrowDown } from "lucide-react";
import { useAssets } from "../../assets/hooks/assets.hook";
import { useThisMonthSummary } from "../hooks/summary.hook";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";

export default function FinancialSnapshotContainer() {
  const mounted = useMounted();

  const {
    data: assets,
    isPending: isAssetsPending,
    isFetching: isAssetsFetching,
  } = useAssets();
  const {
    data: summary,
    isPending: isSummaryPending,
    isFetching: isSummaryFetching,
  } = useThisMonthSummary();

  // ponytail: The backend now provides totalNetWorth directly, avoiding frontend calculations.
  const netWorth = summary?.totalNetWorth || 0;
  const netChange = summary?.net || 0;

  const isLoading =
    !mounted ||
    isAssetsPending ||
    isAssetsFetching ||
    isSummaryPending ||
    isSummaryFetching;

  if (isLoading) {
    return (
      <div className="flex flex-col px-3 py-4 bg-white rounded-md border border-gray-300 gap-2 min-h-27.5 justify-center">
        <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
          FINANCIAL SNAPSHOT
        </span>
        <Skeleton className="h-8 w-48 mb-1" />
        <Skeleton className="h-5 w-40" />
      </div>
    );
  }

  const hasAssets = assets && assets.length > 0;

  if (!hasAssets) {
    return (
      <div className="flex flex-col px-3 py-4 bg-white rounded-md border border-gray-300 gap-2">
        <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
          FINANCIAL SNAPSHOT
        </span>
        <span className="text-3xl font-bold">฿ 0</span>
        <div className="flex items-center gap-1">
          <span className="text-sm text-primary font-medium">
            Start recording your transactions.
          </span>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col px-3 py-4 bg-white rounded-md border border-gray-300 gap-2">
      <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
        FINANCIAL SNAPSHOT
      </span>
      <span className="text-3xl font-bold text-gray-900">
        ฿{" "}
        {netWorth.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}
      </span>
      <div className="flex items-center gap-1">
        {netChange >= 0 ? (
          <>
            <ArrowUp className="text-[#10b981]" size={16} />
            <span className="text-sm text-[#10b981] font-medium">
              +
              {netChange.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}{" "}
              This month
            </span>
          </>
        ) : (
          <>
            <ArrowDown className="text-red-500" size={16} />
            <span className="text-sm text-red-500 font-medium">
              {netChange.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}{" "}
              This month
            </span>
          </>
        )}
      </div>
    </section>
  );
}
