import { cookies } from "next/headers";
import ShowProfileContainer from "@/features/account/containers/ShowProfileContainer";
import { getCurrentUserServer } from "@/features/account/services/account.server";
import DashboardAssetList from "@/features/assets/components/DashboardAssetList";
import DashboardAssetHeader from "@/features/dashboard/components/DashboardAssetHeader";
import DashboardGuestAssets from "@/features/dashboard/components/DashboardGuestAssets";
import FinancialSnapshotClient from "@/features/dashboard/components/FinancialSnapshotClient";
import RecentJournalContainer from "@/features/journal/containers/RecentJournalContainer";
import { getAssetsServer } from "@/features/assets/services/assets.server";
import { getRecentTransactionsServer } from "@/features/transactions/services/transactions.server";
import { getThisMonthSummaryServer } from "@/features/dashboard/services/summary.server";
import DashboardGuestContainer from "./DashboardGuestContainer";

export default async function DashboardContainer() {
  const cookieStore = await cookies();

  if (!cookieStore.has("access_token")) {
    return (
      <>
        <ShowProfileContainer initialUser={null} />
        <DashboardGuestContainer />
      </>
    );
  }

  const [initialUser, assets, summary, recentTransactions] = await Promise.all([
    getCurrentUserServer(),
    getAssetsServer(),
    getThisMonthSummaryServer(),
    getRecentTransactionsServer(),
  ]);

  if (!initialUser || !assets || !summary || !recentTransactions) {
    throw new Error("Failed to load authenticated dashboard data");
  }

  const languageCookie = cookieStore.get("findmytang-language")?.value;
  const language = languageCookie === "th" ? "th" : "en";
  const hasAssets = assets.some((asset) => !asset.isArchived);

  return (
    <>
      <ShowProfileContainer initialUser={initialUser} />
      <div className="space-y-4">
        <div className="px-4">
          <FinancialSnapshotClient
            initialAssets={assets}
            initialSummary={summary}
          />
        </div>

        <div className="px-4">
          {hasAssets ? (
            <section className="space-y-4">
              <DashboardAssetHeader language={language} />
              <DashboardAssetList assets={assets} language={language} />
            </section>
          ) : (
            <DashboardGuestAssets initialAssets={assets} />
          )}
        </div>

        <RecentJournalContainer initialTransactions={recentTransactions} />
      </div>
    </>
  );
}
