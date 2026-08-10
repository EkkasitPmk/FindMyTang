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
    <FinancialSnapshotClient
      initialAssets={initialAssets}
      initialSummary={initialSummary}
    />
  );
}
