import { AssetType } from "../types/assets.type";
import {
  Banknote,
  Bitcoin,
  Landmark,
  LineChart,
  Package,
  Wallet,
} from "lucide-react";

export const getAssetIcon = (
  type: AssetType,
  color?: string | null,
  size: number = 18,
) => {
  const iconProps = {
    size,
    className: color ? "" : "text-gray-600",
    color: color || undefined,
  };

  switch (type) {
    case AssetType.BANK:
      return <Landmark {...iconProps} />;
    case AssetType.E_WALLET:
      return <Wallet {...iconProps} />;
    case AssetType.INVESTMENT:
      return <LineChart {...iconProps} />;
    case AssetType.CRYPTO:
      return <Bitcoin {...iconProps} />;
    case AssetType.CASH:
      return <Banknote {...iconProps} />;
    case AssetType.OTHER:
    default:
      return <Package {...iconProps} />;
  }
};
