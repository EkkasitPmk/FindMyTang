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

  const isCandidateAuth =
    cookieStore.has("access_token") || cookieStore.has("refresh_token");

  if (!isCandidateAuth) {
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

  const languageCookie = cookieStore.get?.("findmytang-language")?.value;
  const language = languageCookie === "th" ? "th" : "en";
  const hasAssets = assets ? assets.some((asset) => !asset.isArchived) : true;

  return (
    <>
      <ShowProfileContainer initialUser={initialUser} />
      <div className="space-y-4">
        <div className="px-4">
          <FinancialSnapshotClient
            initialAssets={assets ?? undefined}
            initialSummary={summary ?? undefined}
          />
        </div>

        <div className="px-4">
          {hasAssets ? (
            <section className="space-y-4">
              <DashboardAssetHeader language={language} />
              <DashboardAssetList
                assets={assets ?? undefined}
                language={language}
              />
            </section>
          ) : (
            <DashboardGuestAssets initialAssets={assets ?? undefined} />
          )}
        </div>

        <RecentJournalContainer
          initialTransactions={recentTransactions ?? undefined}
        />
      </div>
    </>
  );
}
