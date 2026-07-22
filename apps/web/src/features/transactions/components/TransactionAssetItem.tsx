import { cn } from "@/shared/lib/utils/core.util";
import { Coins, Landmark } from "lucide-react";
import { Asset } from "@/shared/lib/types/asset.type";
import { Button } from "@/shared/components/customs/Button";

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
    <Button
      variant="unstyled"
      type="button"
      onClick={() => onClick(asset.id)}
      className={cn(
        "flex items-center justify-center border gap-2 h-14 w-fit rounded-md px-4 py-2 transition-all shrink-0",
        isSelected && !asset.color && "border-primary bg-primary-light",
        !isSelected && "border-border bg-surface-secondary",
      )}
      style={{
        borderColor: isSelected && asset.color ? asset.color : undefined,
        backgroundColor:
          isSelected && asset.color ? `${asset.color}1A` : undefined, // 10% opacity
      }}
    >
      <span className="bg-background p-2 rounded-full">
        {asset.type === "BANK" ? (
          <Landmark
            size={18}
            className={cn(!asset.color && "text-primary")}
            style={{
              color: asset.color ? asset.color : undefined,
            }}
          />
        ) : (
          <Coins
            size={18}
            className={cn(!asset.color && "text-primary-text")}
            style={{
              color: asset.color ? asset.color : undefined,
            }}
          />
        )}
      </span>
      <div className="flex flex-col text-left">
        <span className="text-sm font-bold text-primary-text truncate max-w-30">
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
    </Button>
  );
}
