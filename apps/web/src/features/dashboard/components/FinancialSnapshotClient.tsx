"use client";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import { useThisMonthSummary } from "../hooks/summary.hook";
import FinancialSnapshotCard from "./FinancialSnapshotCard";
import type { Asset } from "@/shared/lib/types/asset.type";
import type { TodaySummaryResponse } from "../schemas/dashboard.response.schema";
import { useFinancialSnapshotPrivacy } from "../hooks/financialSnapshotPrivacy.hook";

export default function FinancialSnapshotClient({
  initialAssets,
  initialSummary,
}: Readonly<{
  initialAssets?: Asset[];
  initialSummary?: TodaySummaryResponse;
}>) {
  const { isPrivate, togglePrivacy } = useFinancialSnapshotPrivacy();
  const { data: assets, isPending: isAssetsPending } = useAssets({
    initialData: initialAssets,
  });
  const { data: summary, isPending: isSummaryPending } =
    useThisMonthSummary(initialSummary);

  return (
    <FinancialSnapshotCard
      netWorth={summary?.totalNetWorth || 0}
      income={summary?.income || 0}
      expense={summary?.expense || 0}
      netChange={summary?.net || 0}
      hasAssets={Boolean(assets && assets.length > 0)}
      isPrivate={isPrivate}
      onTogglePrivacy={togglePrivacy}
      isLoading={isAssetsPending || isSummaryPending}
    />
  );
}
