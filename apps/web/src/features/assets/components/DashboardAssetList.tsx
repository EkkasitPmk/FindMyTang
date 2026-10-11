"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import { useAssetUIStore } from "@/features/assets/hooks/assets.hook";
import { getAssetIcon } from "@/shared/components/customs/AssetIcon";
import { AssetIconWrapper } from "@/shared/components/customs/AssetIconWrapper";
import DashboardAssetMotion from "./DashboardAssetMotion";
import DashboardAssetSkeleton from "./DashboardAssetSkeleton";
import type { Asset } from "@/shared/lib/types/asset.type";
import {
  translations,
  type Language,
  type TranslationKey,
} from "@/shared/lib/configs/translations.config";

export default function DashboardAssetList({
  assets,
  language,
}: Readonly<{ assets?: Asset[]; language: Language }>) {
  const { data: currentAssets = assets, isPending } = useAssets({
    initialData: assets,
  });
  const viewMode = useAssetUIStore((state) => state.dashboardAssetView);
  const t = (key: TranslationKey) =>
    translations[language][key] ?? translations.en[key];

  if (isPending && !currentAssets) return <DashboardAssetSkeleton />;

  const activeAssets = (currentAssets ?? []).filter(
    (asset) => !asset.isArchived,
  );

  if (activeAssets.length === 0) {
    return (
      <div className="bg-surface flex flex-col items-center gap-3 py-8 rounded-md border-2 border-border border-dashed">
        <span className="text-base font-normal text-secondary-text">
          {t("noAssetsLinked")}
        </span>
      </div>
    );
  }

  const locale = language === "th" ? "th-TH" : "en-US";

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-2 gap-2">
        {activeAssets.map((asset) => (
          <DashboardAssetMotion key={asset.id}>
            <Link
              href={`/assets?id=${asset.id}&name=${encodeURIComponent(asset.name)}`}
              className="flex flex-col justify-between bg-surface p-2.5 rounded-xl cursor-pointer hover:bg-surface-secondary transition-all border-t-3 shadow-xs min-h-23 group"
              style={{ borderTopColor: asset.color || "transparent" }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="scale-85 shrink-0">
                  <AssetIconWrapper color={asset.color}>
                    {getAssetIcon(asset.type, asset.color, 16)}
                  </AssetIconWrapper>
                </div>
                <span className="text-[10px] text-secondary-text rounded-full truncate max-w-[70%] shrink-0">
                  {t(`assetType${asset.type}` as TranslationKey)}
                </span>
              </div>
              <div className="flex flex-col mt-2 min-w-0">
                <span className="truncate text-sm font-semibold text-primary-text group-hover:text-primary transition-colors">
                  {asset.name}
                </span>
                <span
                  className={`text-base font-bold truncate mt-0.5 ${
                    asset.balance === 0
                      ? "text-secondary-text"
                      : "text-primary-text"
                  }`}
                >
                  ฿
                  {asset.balance.toLocaleString(locale, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </Link>
          </DashboardAssetMotion>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activeAssets.map((asset) => (
        <DashboardAssetMotion key={asset.id}>
          <Link
            href={`/assets?id=${asset.id}&name=${encodeURIComponent(asset.name)}`}
            className="flex items-center justify-between bg-surface px-3 py-2 rounded-lg cursor-pointer hover:bg-surface-secondary transition-colors border-l-4"
            style={{ borderLeftColor: asset.color || "transparent" }}
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 mr-4">
              <AssetIconWrapper color={asset.color}>
                {getAssetIcon(asset.type, asset.color)}
              </AssetIconWrapper>
              <div className="flex min-w-0 flex-col text-primary-text">
                <span className="truncate text-base font-semibold">
                  {asset.name}
                </span>
                <span className="text-xs">
                  {t(`assetType${asset.type}` as TranslationKey)}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <span
                className={`font-semibold text-base ${
                  asset.balance === 0
                    ? "text-secondary-text"
                    : "text-primary-text"
                }`}
              >
                ฿
                {asset.balance.toLocaleString(locale, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <ChevronRight size={18} className="text-disabled-text" />
            </div>
          </Link>
        </DashboardAssetMotion>
      ))}
    </div>
  );
}
