import { useMemo } from "react";
import { Asset } from "@/shared/lib/types/asset.type";
import TransactionAssetItem from "./TransactionAssetItem";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { cn } from "@/shared/lib/utils/core.util";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { ArrowUpRight } from "lucide-react";
import {
  getRecentAssetIds,
  sortAssetsByRecent,
} from "../helpers/transaction.helper";
export const EXTERNAL_ASSET_ID = "EXTERNAL";

const SKELETON_ASSETS = Array.from({ length: 4 }, (_, i) => i);

interface TransactionAssetListProps {
  assets: Asset[];
  activeAssetId: string | null;
  onSelectAsset: (id: string) => void;
  activeAssetToId?: string | null;
  onSelectAssetTo?: (id: string) => void;
  transactionType?: "EXPENSE" | "INCOME" | "TRANSFER" | "ADJUSTMENT";
  isLoadingAssetList?: boolean;
  label?: string;
  containerClassName?: string;
}

export default function TransactionAssetList({
  assets,
  activeAssetId,
  onSelectAsset,
  activeAssetToId,
  onSelectAssetTo,
  transactionType = "EXPENSE",
  isLoadingAssetList = false,
  label,
  containerClassName,
}: Readonly<TransactionAssetListProps>) {
  const { t } = useTranslation();
  const paddingClass = containerClassName ?? "px-4 lg:px-0";

  const sortedAssets = useMemo(
    () => sortAssetsByRecent(assets, getRecentAssetIds()),
    [assets],
  );

  const renderAssetList = () => {
    if (isLoadingAssetList) {
      return (
        <div className={cn("flex gap-2 py-1 overflow-auto", paddingClass)}>
          {SKELETON_ASSETS.map((id) => (
            <div key={id}>
              <Skeleton className="h-14 w-30 rounded-md" />
            </div>
          ))}
        </div>
      );
    }

    if (assets.length === 0) {
      return (
        <p className="text-xs text-expense border border-error text-center py-4 rounded-md my-1">
          {t("noAssetsFound")}
        </p>
      );
    }

    return (
      <div className={cn("flex gap-2 py-1 overflow-auto", paddingClass)}>
        {sortedAssets.map((asset) => (
          <TransactionAssetItem
            key={asset.id}
            asset={asset}
            isSelected={activeAssetId === asset.id}
            onClick={onSelectAsset}
          />
        ))}
      </div>
    );
  };

  const renderTransferAssetList = () => {
    if (isLoadingAssetList) {
      return (
        <div className={cn("flex gap-2 py-1 overflow-auto", paddingClass)}>
          {SKELETON_ASSETS.map((id) => (
            <div key={id}>
              <Skeleton className="h-14 w-30 rounded-md" />
            </div>
          ))}
        </div>
      );
    }

    const availableAssets = sortedAssets.filter(
      (asset) => asset.id !== activeAssetId,
    );

    const isExternalSelected =
      activeAssetToId === EXTERNAL_ASSET_ID ||
      (availableAssets.length === 0 && !activeAssetToId);

    return (
      <div className={cn("flex gap-2 py-1 overflow-auto", paddingClass)}>
        {availableAssets.map((asset) => (
          <TransactionAssetItem
            key={asset.id}
            asset={asset}
            isSelected={activeAssetToId === asset.id}
            onClick={(id) => onSelectAssetTo?.(id)}
          />
        ))}
        <Button
          variant="unstyled"
          type="button"
          onClick={() => onSelectAssetTo?.(EXTERNAL_ASSET_ID)}
          className={cn(
            "flex items-center justify-center border gap-2 h-14 w-fit rounded-md px-4 py-2 transition-all shrink-0",
            isExternalSelected && "border-primary bg-primary-light",
            !isExternalSelected && "border-border bg-surface-secondary",
          )}
        >
          <span className="bg-background p-2 rounded-full">
            <ArrowUpRight size={18} className="text-secondary-text" />
          </span>
          <div className="flex flex-col text-left">
            <span className="text-sm font-bold text-primary-text whitespace-nowrap">
              {t("externalAccount")}
            </span>
            <span className="text-xs text-secondary-text whitespace-nowrap">
              {t("transferToExternal")}
            </span>
          </div>
        </Button>
      </div>
    );
  };

  return (
    <section className="space-y-1">
      <p
        className={cn(
          "text-sm text-secondary-text font-semibold",
          paddingClass,
        )}
      >
        {label ??
          (transactionType === "TRANSFER" ? t("assetFrom") : t("asset"))}
      </p>

      {renderAssetList()}

      {transactionType === "TRANSFER" && (
        <>
          <div className="flex items-center gap-2 mt-2">
            <p
              className={cn(
                "text-sm text-secondary-text font-semibold",
                paddingClass,
              )}
            >
              {t("assetTo")}
            </p>
          </div>
          {renderTransferAssetList()}
        </>
      )}
    </section>
  );
}
