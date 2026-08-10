"use client";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import DashboardAssetList from "@/features/assets/components/DashboardAssetList";
import DashboardAssetHeader from "@/features/dashboard/components/DashboardAssetHeader";
import DashboardGuestAssets from "@/features/dashboard/components/DashboardGuestAssets";
import FinancialSnapshotClient from "@/features/dashboard/components/FinancialSnapshotClient";
import RecentJournalContainer from "@/features/journal/containers/RecentJournalContainer";

export default function DashboardGuestContainer() {
  const { data: assets } = useAssets();
  const { currentLanguage } = useTranslation();
  const hasAssets = assets?.some((asset) => !asset.isArchived);

  return (
    <div className="space-y-4">
      <div className="px-4">
        <FinancialSnapshotClient />
      </div>

      <div className="px-4">
        {hasAssets ? (
          <section className="space-y-4">
            <DashboardAssetHeader language={currentLanguage} />
            <DashboardAssetList
              assets={assets ?? []}
              language={currentLanguage}
            />
          </section>
        ) : (
          <DashboardGuestAssets />
        )}
      </div>

      <RecentJournalContainer />
    </div>
  );
}
