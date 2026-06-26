import Link from "next/link";
import {
  ChevronRight,
  HandCoins,
  Landmark,
  Link2,
  Plus,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useAssets } from "../hooks/assets.hook";
import { AssetType } from "../types/assets.type";

const getAssetIcon = (type: AssetType) => {
  switch (type) {
    case AssetType.BANK:
      return <Landmark className="text-gray-600" size={18} />;
    case AssetType.E_WALLET:
      return <Wallet className="text-gray-600" size={18} />;
    case AssetType.INVESTMENT:
    case AssetType.CRYPTO:
      return <TrendingUp className="text-gray-600" size={18} />;
    case AssetType.CASH:
    case AssetType.OTHER:
    default:
      return <HandCoins className="text-gray-600" size={18} />;
  }
};

interface ListAssetsContainerProps {
  onAddAsset?: () => void;
}

export default function ListAssetsContainer({
  onAddAsset,
}: Readonly<ListAssetsContainerProps>) {
  const { data: assets, isLoading } = useAssets();

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-medium">Assets</span>
          <button
            type="button"
            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors p-1 rounded-full cursor-pointer"
            onClick={onAddAsset}
            aria-label="Add Asset"
          >
            <Plus size={18} className="text-gray-600" />
          </button>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500 text-sm">
            Loading assets...
          </div>
        ) : assets && assets.length > 0 ? (
          <div className="space-y-1">
            {assets.map((asset) => (
              <Link
                href={`/assets?name=${encodeURIComponent(asset.name)}`}
                key={asset.id}
                className="flex items-center justify-between bg-white p-3 rounded-sm cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 p-2 rounded-full">
                    {getAssetIcon(asset.type)}
                  </span>
                  <span className="text-base font-medium">{asset.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-base">
                    ฿ {asset.balance.toLocaleString()}
                  </span>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white flex flex-col items-center gap-3 py-8 rounded-md border-2 border-gray-200 border-dashed">
            <div className="flex items-center">
              <span className="bg-gray-100 p-4 rounded-full">
                <Landmark className="text-gray-600" size={24} />
              </span>
            </div>
            <span className="text-base font-normal text-gray-600">
              No assets linked yet
            </span>
            <div
              className="flex items-center gap-2 text-primary font-medium cursor-pointer hover:underline"
              onClick={onAddAsset}
            >
              <Link2 size={18} />
              <span>Add Asset</span>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <div className="flex flex-col grow px-4 py-3 rounded-md border border-outline-variant/30">
            <span className="text-sm font-medium">Income</span>
            <span className="text-base font-bold">฿ 45,000</span>
          </div>
          <div className="flex flex-col grow px-4 py-3 rounded-md border border-outline-variant/30">
            <span className="text-sm font-medium">Expanse</span>
            <span className="text-base font-bold">฿ 12,000</span>
          </div>
        </div>
      </div>
    </>
  );
}
