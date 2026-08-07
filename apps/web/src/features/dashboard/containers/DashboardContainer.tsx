import { cookies } from "next/headers";
import { getAssetsServer } from "@/features/assets/services/assets.server";
import { getRecentTransactionsServer } from "@/features/transactions/services/transactions.server";
import { getThisMonthSummaryServer } from "@/features/dashboard/services/summary.server";
import DashboardAssetList from "@/features/assets/components/DashboardAssetList";
import DashboardAssetHeader from "@/features/dashboard/components/DashboardAssetHeader";
import DashboardGuestAssets from "@/features/dashboard/components/DashboardGuestAssets";
import FinancialSnapshotContainer from "./FinancialSnapshotContainer";
import RecentJournalServer from "@/features/journal/containers/RecentJournalServer";
import type { Asset } from "@/shared/lib/types/asset.type";
import type { PaginatedTransactionResponse } from "@/shared/lib/types/transaction.type";
import type { TodaySummaryResponse } from "../schemas/dashboard.response.schema";

export default async function DashboardContainer() {
  const [initialAssets, initialTransactions, initialSummary] =
    await Promise.all([
      getAssetsServer(),
      getRecentTransactionsServer(),
      getThisMonthSummaryServer(),
    ]);
  const language =
    (await cookies()).get("findmytang-language")?.value === "th" ? "th" : "en";

  const assets = (initialAssets as Asset[] | null) ?? undefined;
  const hasServerAssetList = assets?.some((asset) => !asset.isArchived);
  const transactions =
    (initialTransactions as PaginatedTransactionResponse | null) ?? undefined;
  const summary = (initialSummary as TodaySummaryResponse | null) ?? undefined;

  return (
    <div className="space-y-4">
      <div className="px-4">
        <FinancialSnapshotContainer
          initialAssets={assets}
          initialSummary={summary}
        />
      </div>

      <div className="px-4">
        {hasServerAssetList ? (
          <section className="space-y-4">
            <DashboardAssetHeader language={language} />
            <DashboardAssetList assets={assets!} language={language} />
          </section>
        ) : (
          <DashboardGuestAssets initialAssets={assets} />
        )}
      </div>

      <RecentJournalServer initialTransactions={transactions} />
    </div>
  );
}
