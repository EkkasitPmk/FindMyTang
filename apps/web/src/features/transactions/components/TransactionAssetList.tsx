import { Asset } from "@/features/assets/types/assets.type";
import TransactionAssetItem from "./TransactionAssetItem";

interface TransactionAssetListProps {
  assets: Asset[];
  activeAssetId: string | null;
  onSelectAsset: (id: string) => void;
  activeAssetToId?: string | null;
  onSelectAssetTo?: (id: string) => void;
  transactionType: "EXPENSE" | "INCOME" | "TRANSFER" | "ADJUSTMENT";
}

export default function TransactionAssetList({
  assets,
  activeAssetId,
  onSelectAsset,
  activeAssetToId,
  onSelectAssetTo,
  transactionType,
}: Readonly<TransactionAssetListProps>) {
  return (
    <section className="space-y-1">
      <p className="uppercase text-sm text-secondary-text font-medium">
        ASSET
        {transactionType === "TRANSFER" && " (from)"}
      </p>
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

      {transactionType === "TRANSFER" && (
        <>
          <div className="flex items-center gap-2">
            <p className="uppercase text-sm text-secondary-text font-medium">
              ASSET (to)
            </p>
          </div>
          {assets.filter((asset) => asset.id !== activeAssetId).length === 0 ? (
            <p className="text-xs text-red-500 border border-error text-center py-4 rounded-md">
              You need at least two assets to make a transfer.
            </p>
          ) : (
            <div className="flex gap-2 py-1 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
              {assets
                .filter((asset) => asset.id !== activeAssetId)
                .map((asset) => (
                  <TransactionAssetItem
                    key={asset.id}
                    asset={asset}
                    isSelected={activeAssetToId === asset.id}
                    onClick={(id) => onSelectAssetTo?.(id)}
                  />
                ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
