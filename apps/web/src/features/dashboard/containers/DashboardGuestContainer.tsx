import DashboardGuestAssetSection from "@/features/dashboard/components/DashboardGuestAssetSection";
import FinancialSnapshotClient from "@/features/dashboard/components/FinancialSnapshotClient";
import RecentJournalContainer from "@/features/journal/containers/RecentJournalContainer";

export default function DashboardGuestContainer() {
  return (
    <div className="space-y-4">
      <div className="px-4">
        <FinancialSnapshotClient />
      </div>

      <div className="px-4">
        <DashboardGuestAssetSection />
      </div>

      <RecentJournalContainer />
    </div>
  );
}
