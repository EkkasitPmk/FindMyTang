import { AssetType } from "@/shared/lib/types/asset.type";
import {
  Banknote,
  Bitcoin,
  Landmark,
  LineChart,
  Package,
  Wallet,
} from "lucide-react";

export const getAssetIcon = (
  type: AssetType | string,
  color?: string | null,
  size: number = 18,
) => {
  const iconProps = {
    size,
    className: color ? "" : "text-secondary-text",
    color: color || undefined,
  };

  switch (type) {
    case AssetType.BANK:
    case "BANK":
      return <Landmark {...iconProps} />;
    case AssetType.E_WALLET:
    case "E_WALLET":
      return <Wallet {...iconProps} />;
    case AssetType.INVESTMENT:
    case "INVESTMENT":
      return <LineChart {...iconProps} />;
    case AssetType.CRYPTO:
    case "CRYPTO":
      return <Bitcoin {...iconProps} />;
    case AssetType.CASH:
    case "CASH":
      return <Banknote {...iconProps} />;
    case AssetType.OTHER:
    case "OTHER":
    default:
      return <Package {...iconProps} />;
  }
};
