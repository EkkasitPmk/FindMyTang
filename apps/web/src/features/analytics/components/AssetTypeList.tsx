import { AssetDistributionGroup } from "../schemas/analytics.response.schema";
import { formatCurrency } from "@/shared/lib/utils/currency.util";
import { ChevronDown } from "lucide-react";
import { getAssetIcon } from "@/shared/components/customs/AssetIcon";
import { AssetType } from "@/shared/lib/types/asset.type";
import { AssetIconWrapper } from "@/shared/components/customs/AssetIconWrapper";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { TranslationKey } from "@/shared/lib/configs/translations.config";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/shared/components/animate-ui/primitives/radix/collapsible";

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
    <div className="space-y-2 pb-18">
      {data.map((group, index) => {
        const isExpanded = expandedTypes[group.assetType] ?? false;

        return (
          <Collapsible
            key={group.assetType}
            open={isExpanded}
            onOpenChange={() => onToggleExpand(group.assetType)}
            className="group/collapsible bg-surface rounded-xl border border-border overflow-hidden"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="unstyled"
                className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-surface-secondary cursor-pointer"
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
                    <p className="text-[0.9375rem] font-medium text-primary-text">
                      {t(`assetType${group.assetType}` as TranslationKey) ||
                        group.assetType}
                    </p>
                    <p className="text-[0.75rem] text-secondary-text">
                      {group.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-[0.9375rem] text-primary-text">
                    {formatCurrency(group.totalBalance)}
                  </span>
                  <ChevronDown className="w-4 h-4 text-disabled-text transition-transform duration-300 group-data-[state=open]/collapsible:-rotate-180" />
                </div>
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent>
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
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};
