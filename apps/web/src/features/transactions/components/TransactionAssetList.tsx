import { Asset } from "@/shared/lib/types/asset.type";
import TransactionAssetItem from "./TransactionAssetItem";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

const SKELETON_ASSETS = Array.from({ length: 4 }, (_, i) => i);

interface TransactionAssetListProps {
  assets: Asset[];
  activeAssetId: string | null;
  onSelectAsset: (id: string) => void;
  activeAssetToId?: string | null;
  onSelectAssetTo?: (id: string) => void;
  transactionType: "EXPENSE" | "INCOME" | "TRANSFER" | "ADJUSTMENT";
  isLoadingAssetList: boolean;
}

export default function TransactionAssetList({
  assets,
  activeAssetId,
  onSelectAsset,
  activeAssetToId,
  onSelectAssetTo,
  transactionType,
  isLoadingAssetList,
}: Readonly<TransactionAssetListProps>) {
  const { t } = useTranslation();

  const renderAssetList = () => {
    if (isLoadingAssetList) {
      return (
        <div className="flex gap-2 py-1 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
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
      <div className="flex gap-2 py-1 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        {assets.map((asset) => (
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
        <div className="flex gap-2 py-1 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
          {SKELETON_ASSETS.map((id) => (
            <div key={id}>
              <Skeleton className="h-14 w-30 rounded-md" />
            </div>
          ))}
        </div>
      );
    }

    const availableAssets = assets.filter(
      (asset) => asset.id !== activeAssetId,
    );

    if (availableAssets.length === 0) {
      return (
        <p className="text-xs text-expense border border-error text-center py-4 rounded-md">
          {t("needTwoAssetsForTransfer")}
        </p>
      );
    }

    return (
      <div className="flex gap-2 py-1 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        {availableAssets.map((asset) => (
          <TransactionAssetItem
            key={asset.id}
            asset={asset}
            isSelected={activeAssetToId === asset.id}
            onClick={(id) => onSelectAssetTo?.(id)}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="space-y-1">
      <p className="uppercase text-sm text-secondary-text font-medium">
        {transactionType === "TRANSFER" ? t("assetFrom") : t("asset")}
      </p>

      {renderAssetList()}

      {transactionType === "TRANSFER" && (
        <>
          <div className="flex items-center gap-2 mt-2">
            <p className="uppercase text-sm text-secondary-text font-medium">
              {t("assetTo")}
            </p>
          </div>
          {renderTransferAssetList()}
        </>
      )}
    </section>
  );
}
