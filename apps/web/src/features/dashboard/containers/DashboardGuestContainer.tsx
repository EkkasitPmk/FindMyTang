import DashboardGuestAssetSection from "@/features/dashboard/components/DashboardGuestAssetSection";
import FinancialSnapshotClient from "@/features/dashboard/components/FinancialSnapshotClient";
import RecentJournalContainer from "@/features/journal/containers/RecentJournalContainer";
import DashboardRecurringAlert from "@/features/dashboard/components/DashboardRecurringAlert";

export default function DashboardGuestContainer() {
  return (
    <div className="space-y-4">
      <div className="px-4">
        <FinancialSnapshotClient />
      </div>

      <DashboardRecurringAlert />

      <div className="px-4">
        <DashboardGuestAssetSection />
      </div>

      <RecentJournalContainer />
    </div>
  );
}
