"use client";
import Link from "next/link";
import { ChevronRight, Landmark, Link2, Plus } from "lucide-react";
import { useAssets } from "../hooks/assets.hook";
import { getAssetIcon } from "../components/AssetIcon";
import { useThisMonthSummary } from "@/features/home/hooks/summary.hook";
import { Button } from "@/shared/components/customs/Button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";
import { usePathname } from "next/navigation";

const SKELETON_ASSETS = Array.from({ length: 3 }, (_, i) => i);

interface ListAssetsContainerProps {
  onAddAsset?: () => void;
  id?: string | null;
}

export default function ListAssetsContainer({
  onAddAsset,
  id,
}: Readonly<ListAssetsContainerProps>) {
  const pathname = usePathname();

  const mounted = useMounted();

  const {
    data: assets,
    isPending: isAssetsPending,
    isFetching: isAssetsFetching,
  } = useAssets();
  const { data: summary } = useThisMonthSummary();

  const isLoading = !mounted || isAssetsPending || isAssetsFetching;

  const renderAssetsList = () => {
    if (isLoading) {
      return (
        <div className="space-y-1">
          {SKELETON_ASSETS.map((i) => (
            <div
              key={`asset-skeleton-${i}`}
              className="flex items-center justify-between bg-white px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors border-l-4 border-gray-200"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-9.5 w-9.5 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-5 w-20" />
                <ChevronRight size={18} className="text-gray-200" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (assets) {
      const activeAssets = assets.filter((a) => !a.isArchived);
      if (activeAssets.length > 0) {
        return (
          <div className="space-y-1">
            {activeAssets.map((asset) => (
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
                  <div className="flex flex-col text-gray-800">
                    <span className="text-base font-semibold">
                      {asset.name}
                    </span>
                    <span className="text-xs">{asset.type}</span>
                  </div>
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
      {id === undefined && pathname === "/assets" ? (
        <section className="px-4 my-2">{renderAssetsList()}</section>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <Link
              href="/assets"
              className="text-lg font-medium hover:text-primary transition-colors cursor-pointer flex items-center gap-1 group"
            >
              Assets
              <ChevronRight
                size={18}
                className="text-gray-400 group-hover:text-primary transition-colors"
              />
            </Link>
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
            <div className="flex flex-col grow w-full px-4 py-3 rounded-md bg-white border border-outline-variant/30">
              <span className="text-sm font-medium">Income</span>
              {isLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <span className="text-base font-bold">
                  ฿ {summary?.income?.toLocaleString() ?? 0}
                </span>
              )}
            </div>
            <div className="flex flex-col grow w-full px-4 py-3 rounded-md bg-white border border-outline-variant/30">
              <span className="text-sm font-medium">Expense</span>
              {isLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <span className="text-base font-bold">
                  ฿ {summary?.expense?.toLocaleString() ?? 0}
                </span>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
