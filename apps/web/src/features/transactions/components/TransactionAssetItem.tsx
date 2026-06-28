import { cn } from "@/shared/lib/utils";
import { Coins, Landmark } from "lucide-react";
import { Asset } from "@/features/assets/types/assets.type";

interface TransactionAssetItemProps {
  asset: Asset;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export default function TransactionAssetItem({
  asset,
  isSelected,
  onClick,
}: Readonly<TransactionAssetItemProps>) {
  return (
    <button
      type="button"
      onClick={() => onClick(asset.id)}
      className={cn(
        "flex items-center justify-center border gap-2 w-fit max-w-30 rounded-md px-4 py-2 transition-all shrink-0",
        isSelected
          ? "border-primary bg-primary-light"
          : "border-border bg-surface-secondary",
      )}
    >
      <span className="bg-background p-2 rounded-full">
        {asset.type === "BANK" ? (
          <Landmark
            size={18}
            className="text-primary"
            style={{
              color: isSelected && asset.color ? asset.color : undefined,
            }}
          />
        ) : (
          <Coins
            size={18}
            className="text-primary-text"
            style={{
              color: isSelected && asset.color ? asset.color : undefined,
            }}
          />
        )}
      </span>
      <div className="flex flex-col text-left">
        <span className="text-sm font-bold text-primary-text truncate max-w-20">
          {asset.name}
        </span>
        <span className="text-xs text-secondary-text truncate max-w-20">
          ฿
          {asset.balance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    </button>
  );
}
