import { cn } from "@/shared/lib/utils/core.util";
import { getAssetIcon } from "@/shared/components/customs/AssetIcon";
import { Asset } from "@/shared/lib/types/asset.type";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";

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
        {getAssetIcon(asset.type, asset.color, 18)}
      </span>
      <div className="flex flex-col text-left">
        <span className="text-sm font-bold text-primary-text whitespace-nowrap">
          {asset.name}
        </span>
        <span className="text-xs text-secondary-text whitespace-nowrap">
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
