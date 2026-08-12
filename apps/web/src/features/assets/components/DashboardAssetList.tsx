"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import { getAssetIcon } from "@/shared/components/customs/AssetIcon";
import { AssetIconWrapper } from "@/shared/components/customs/AssetIconWrapper";
import DashboardAssetMotion from "./DashboardAssetMotion";
import type { Asset } from "@/shared/lib/types/asset.type";
import {
  translations,
  type Language,
  type TranslationKey,
} from "@/shared/lib/configs/translations.config";

export default function DashboardAssetList({
  assets,
  language,
}: Readonly<{ assets: Asset[]; language: Language }>) {
  const { data: currentAssets = assets } = useAssets({
    initialData: assets,
  });
  const t = (key: TranslationKey) =>
    translations[language][key] ?? translations.en[key];
  const activeAssets = currentAssets.filter((asset) => !asset.isArchived);

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
              <span className="font-semibold text-base text-primary-text">
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
