import { AssetDistributionGroup } from "../types/analytics.type";
import { formatCurrency } from "@/shared/lib/utils/currency.util";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getAssetIcon } from "@/features/assets/components/AssetIcon";
import { AssetType } from "@/features/assets/types/assets.type";
import { AssetIconWrapper } from "@/shared/components/customs/AssetIconWrapper";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { TranslationKey } from "@/shared/lib/configs/translations.config";

interface AssetTypeListProps {
  data: AssetDistributionGroup[];
  expandedTypes: Record<string, boolean>;
  onToggleExpand: (type: string) => void;
}

export const AssetTypeList = ({
  data,
  expandedTypes,
  onToggleExpand,
}: AssetTypeListProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2 pb-4">
      {data.map((group, index) => {
        const isExpanded = expandedTypes[group.assetType];

        return (
          <div
            key={group.assetType}
            className="bg-surface rounded-xl border overflow-hidden"
          >
            <button
              onClick={() => onToggleExpand(group.assetType)}
              className="w-full flex items-center justify-between p-4 active-press transition-colors hover:bg-surface-secondary"
            >
              <div className="flex items-center gap-3">
                <AssetIconWrapper color={`var(--chart-${(index % 5) + 1})`}>
                  {getAssetIcon(
                    group.assetType as AssetType,
                    "currentColor",
                    18,
                  )}
                </AssetIconWrapper>
                <div className="text-left">
                  <p className="text-[15px] font-medium text-primary-text">
                    {t(`assetType${group.assetType}` as TranslationKey) ||
                      group.assetType}
                  </p>
                  <p className="text-[12px] text-secondary-text">
                    {group.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[15px] text-primary-text">
                  {formatCurrency(group.totalBalance)}
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-disabled-text" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-disabled-text" />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 pt-1 border-t border-border bg-surface-secondary/50">
                <div className="space-y-3 mt-3">
                  {group.assets.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-secondary-text">{asset.name}</span>
                      <span className="font-medium text-primary-text">
                        {formatCurrency(asset.balance)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
