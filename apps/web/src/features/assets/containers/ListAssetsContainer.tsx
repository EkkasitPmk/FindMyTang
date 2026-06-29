import Link from "next/link";
import { ChevronRight, Landmark, Link2, Plus } from "lucide-react";
import { useAssets } from "../hooks/assets.hook";
import { getAssetIcon } from "../utils/assets.util";
import { useThisMonthSummary } from "../../financialSnapshot/hooks/summary.hook";
import { Button } from "@/shared/components/customs/Button";

interface ListAssetsContainerProps {
  onAddAsset?: () => void;
  id?: string | null;
}

export default function ListAssetsContainer({
  onAddAsset,
  id,
}: Readonly<ListAssetsContainerProps>) {
  const { data: assets, isLoading } = useAssets();
  const { data: summary } = useThisMonthSummary();

  const renderAssetsList = () => {
    if (isLoading) {
      return (
        <div className="py-8 text-center text-gray-500 text-sm">
          Loading assets...
        </div>
      );
    }

    if (assets && assets.length > 0) {
      return (
        <div className="space-y-1">
          {assets.map((asset) => (
            <Link
              href={`/assets?id=${asset.id}&name=${encodeURIComponent(asset.name)}`}
              key={asset.id}
              className="flex items-center justify-between bg-white px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors border-l-4"
              style={{
                borderLeftColor: asset.color || "transparent",
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className={
                    asset.color
                      ? "p-2.5 rounded-full"
                      : "bg-gray-100 p-2.5 rounded-full"
                  }
                  style={
                    asset.color
                      ? {
                          backgroundColor: `${asset.color}1a`,
                          color: asset.color,
                        }
                      : undefined
                  }
                >
                  {getAssetIcon(asset.type, asset.color)}
                </span>
                <span className="text-base font-semibold text-gray-800">
                  {asset.name}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-base text-gray-900">
                  ฿ {asset.balance.toLocaleString()}
                </span>
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      );
    }

    return (
      <div className="bg-white flex flex-col items-center gap-3 py-8 rounded-md border-2 border-gray-200 border-dashed">
        <div className="flex items-center">
          <span className="bg-gray-100 p-4 rounded-full">
            <Landmark className="text-gray-600" size={24} />
          </span>
        </div>
        <span className="text-base font-normal text-gray-600">
          No assets linked yet
        </span>
        <Button
          variant="unstyled"
          type="button"
          className="flex items-center gap-2 text-primary font-medium cursor-pointer hover:underline bg-transparent border-none p-0"
          onClick={onAddAsset}
        >
          <Link2 size={18} />
          <span>Add Asset</span>
        </Button>
      </div>
    );
  };

  return (
    <>
      {id === null ? (
        <div className="my-2">{renderAssetsList()}</div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-medium">Assets</span>
            <Button
              variant="unstyled"
              type="button"
              className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors p-1 rounded-full cursor-pointer"
              onClick={onAddAsset}
              aria-label="Add Asset"
            >
              <Plus size={18} className="text-gray-600" />
            </Button>
          </div>

          {renderAssetsList()}

          <div className="flex gap-4">
            <div className="flex flex-col grow px-4 py-3 rounded-md bg-white border border-outline-variant/30">
              <span className="text-sm font-medium">Income</span>
              <span className="text-base font-bold">
                ฿ {summary?.income?.toLocaleString() ?? 0}
              </span>
            </div>
            <div className="flex flex-col grow px-4 py-3 rounded-md bg-white border border-outline-variant/30">
              <span className="text-sm font-medium">Expense</span>
              <span className="text-base font-bold">
                ฿ {summary?.expense?.toLocaleString() ?? 0}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
