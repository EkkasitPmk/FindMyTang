import FinancialSnapshotCardClient from "../components/FinancialSnapshotCardClient";
import FinancialSnapshotClient from "../components/FinancialSnapshotClient";
import FinancialSnapshotEmpty from "../components/FinancialSnapshotEmpty";
import type { Asset } from "@/shared/lib/types/asset.type";
import type { TodaySummaryResponse } from "../schemas/dashboard.response.schema";

export default function FinancialSnapshotContainer({
  initialAssets,
  initialSummary,
}: Readonly<{
  initialAssets?: Asset[];
  initialSummary?: TodaySummaryResponse;
}>) {
  if (!initialAssets || !initialSummary) {
    return (
      <FinancialSnapshotClient
        initialAssets={initialAssets}
        initialSummary={initialSummary}
      />
    );
  }

  if (initialAssets.length === 0) {
    return <FinancialSnapshotEmpty />;
  }

  return (
    <FinancialSnapshotCardClient
      netWorth={initialSummary.totalNetWorth || 0}
      income={initialSummary.income || 0}
      expense={initialSummary.expense || 0}
      netChange={initialSummary.net || 0}
      hasAssets={initialAssets.length > 0}
    />
  );
}
