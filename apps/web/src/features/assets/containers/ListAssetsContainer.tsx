"use client";
import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { useAssets } from "../hooks/assets.hook";
import { getAssetIcon } from "../components/AssetIcon";
import { EmptyAssetList } from "../../../shared/components/customs/EmptyAssetList";
import { useThisMonthSummary } from "@/features/home/hooks/summary.hook";
import { AssetIconWrapper } from "@/shared/components/customs/AssetIconWrapper";
import { Button } from "@/shared/components/customs/Button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { TranslationKey } from "@/shared/lib/configs/translations.config";

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
  const { t, locale } = useTranslation();

  const mounted = useMounted();

  const { data: assets, isPending: isAssetsPending } = useAssets();
  const { data: summary, isPending: isSummaryPending } = useThisMonthSummary();

  const isLoading = !mounted || isAssetsPending;
  const isSummaryLoading = !mounted || isSummaryPending;

  const renderAssetsList = () => {
    if (isLoading) {
      return (
        <div className="space-y-1">
          {SKELETON_ASSETS.map((i) => (
            <div
              key={`asset-skeleton-${i}`}
              className="flex items-center justify-between bg-surface px-3 py-2 rounded-lg cursor-pointer hover:bg-surface-secondary transition-colors border-l-4 border-border"
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
                <ChevronRight size={18} className="text-disabled-text" />
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
                className="flex items-center justify-between bg-surface px-3 py-2 rounded-lg cursor-pointer hover:bg-surface-secondary transition-colors border-l-4"
                style={{
                  borderLeftColor: asset.color || "transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <AssetIconWrapper color={asset.color}>
                    {getAssetIcon(asset.type, asset.color)}
                  </AssetIconWrapper>
                  <div className="flex flex-col text-primary-text">
                    <span className="text-base font-semibold">
                      {asset.name}
                    </span>
                    <span className="text-xs">
                      {t(`assetType${asset.type}` as TranslationKey)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-base text-primary-text">
                    ฿{" "}
                    {asset.balance.toLocaleString(locale, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <ChevronRight size={18} className="text-disabled-text" />
                </div>
              </Link>
            ))}
          </div>
        );
      }
    }

    return <EmptyAssetList onAddAsset={onAddAsset} />;
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
              {t("assetsTitle")}
              <ChevronRight
                size={18}
                className="text-disabled-text group-hover:text-primary transition-colors"
              />
            </Link>
            <Button
              variant="unstyled"
              type="button"
              className="flex items-center justify-center bg-surface-secondary hover:bg-border transition-colors p-1 rounded-full cursor-pointer"
              onClick={onAddAsset}
              aria-label={t("addAsset")}
            >
              <Plus size={18} className="text-secondary-text" />
            </Button>
          </div>

          {renderAssetsList()}

          <div className="flex gap-4">
            <div className="flex flex-col grow w-full px-4 py-3 rounded-md bg-surface border border-border/30">
              <span className="text-sm font-medium">{t("income")}</span>
              {isSummaryLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <span className="text-base font-bold">
                  ฿{" "}
                  {summary?.income?.toLocaleString(locale, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) ?? "0.00"}
                </span>
              )}
            </div>
            <div className="flex flex-col grow w-full px-4 py-3 rounded-md bg-surface border border-border/30">
              <span className="text-sm font-medium">{t("expense")}</span>
              {isSummaryLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <span className="text-base font-bold">
                  ฿{" "}
                  {summary?.expense?.toLocaleString(locale, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) ?? "0.00"}
                </span>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
