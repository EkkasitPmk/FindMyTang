import { AssetDistributionGroup } from "../types/analytics.type";
import { formatCurrency } from "@/shared/lib/utils/currency.util";

interface AssetDistributionBarProps {
  data: AssetDistributionGroup[];
  totalAssets: number;
}

export const AssetDistributionBar = ({
  data,
  totalAssets,
}: AssetDistributionBarProps) => {
  return (
    <div className="bg-surface rounded-xl border p-5">
      <div className="mb-4">
        <p className="text-sm font-medium text-secondary-text mb-1">
          Total Assets
        </p>
        <p className="text-3xl font-bold text-primary-text">
          {formatCurrency(totalAssets)}
        </p>
      </div>

      <div className="h-4 w-full flex rounded-full overflow-hidden mb-3 bg-surface-secondary">
        {data.map((item, i) => (
          <div
            key={item.assetType}
            className="h-full transition-all duration-500"
            style={{
              width: `${item.percentage}%`,
              backgroundColor: `var(--chart-${(i % 5) + 1})`,
            }}
            title={`${item.assetType}: ${item.percentage.toFixed(1)}%`}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {data.map((item, i) => (
          <div
            key={item.assetType}
            className="flex items-center gap-1.5 text-xs text-secondary-text"
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: `var(--chart-${(i % 5) + 1})` }}
            />
            <span>{item.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
