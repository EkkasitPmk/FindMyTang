import { ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { useAssets } from "../../assets/hooks/assets.hook";
import { useThisMonthSummary } from "../hooks/summary.hook";

export default function FinancialSnapshotContainer() {
  const { data: assets, isLoading: isLoadingAssets } = useAssets();
  const { data: summary, isLoading: isLoadingSummary } = useThisMonthSummary();

  const netWorth =
    assets?.reduce((sum, asset) => sum + Number(asset.balance), 0) || 0;
  const netChange = summary?.net || 0;

  const isLoading = isLoadingAssets || isLoadingSummary;

  if (isLoading) {
    return (
      <div className="flex flex-col px-3 py-4 bg-white rounded-md border border-gray-300 gap-2 min-h-27.5 justify-center">
        <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
          FINANCIAL SNAPSHOT
        </span>
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="animate-spin" size={20} />
          <span className="text-sm font-medium">Calculating...</span>
        </div>
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
