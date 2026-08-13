"use client";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import DashboardAssetList from "@/features/assets/components/DashboardAssetList";
import DashboardAssetHeader from "./DashboardAssetHeader";
import DashboardGuestAssets from "./DashboardGuestAssets";

export default function DashboardGuestAssetSection() {
  const { data: assets } = useAssets();
  const { currentLanguage } = useTranslation();
  const hasAssets = assets?.some((asset) => !asset.isArchived);

  if (!hasAssets) return <DashboardGuestAssets />;

  return (
    <section className="space-y-4">
      <DashboardAssetHeader language={currentLanguage} />
      <DashboardAssetList assets={assets ?? []} language={currentLanguage} />
    </section>
  );
}
