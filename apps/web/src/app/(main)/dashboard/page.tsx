import DashboardContainer from "@/features/dashboard/containers/DashboardContainer";
import { getAssetsServer } from "@/features/assets/services/assets.server";
import { getRecentTransactionsServer } from "@/features/transactions/services/transactions.server";
import { getThisMonthSummaryServer } from "@/features/dashboard/services/summary.server";
import DashboardAssetList from "@/features/assets/components/DashboardAssetList";
import RecentJournalServer from "@/features/journal/containers/RecentJournalServer";
import { cookies } from "next/headers";
import type { Asset } from "@/shared/lib/types/asset.type";
import type { PaginatedTransactionResponse } from "@/shared/lib/types/transaction.type";
import type { TodaySummaryResponse } from "@/features/dashboard/schemas/dashboard.response.schema";

export default async function DashboardPage() {
  const [initialAssets, initialTransactions, initialSummary] =
    await Promise.all([
      getAssetsServer(),
      getRecentTransactionsServer(),
      getThisMonthSummaryServer(),
    ]);
  const language =
    (await cookies()).get("findmytang-language")?.value === "th" ? "th" : "en";

  return (
    <DashboardContainer
      initialAssets={(initialAssets as Asset[] | null) ?? undefined}
      initialSummary={
        (initialSummary as TodaySummaryResponse | null) ?? undefined
      }
      serverAssetList={
        initialAssets?.some((asset) => !asset.isArchived) ? (
          <DashboardAssetList assets={initialAssets} language={language} />
        ) : undefined
      }
      serverRecentJournal={
        <RecentJournalServer
          initialTransactions={
            (initialTransactions as PaginatedTransactionResponse | null) ??
            undefined
          }
        />
      }
    />
  );
}
