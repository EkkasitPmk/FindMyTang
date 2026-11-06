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

  const activeAssets = assets?.filter((a) => !a.isArchived && !a.deletedAt);
  let calculatedTotalNetWorth: number | undefined;
  let calculatedExcludedNetWorth: number | undefined;

  if (activeAssets) {
    calculatedTotalNetWorth = 0;
    calculatedExcludedNetWorth = 0;
    activeAssets.forEach((a) => {
      const bal = Number(a.balance);
      if (a.includeInSnapshot === false) {
        calculatedExcludedNetWorth! += bal;
      } else {
        const savings = Math.min(
          Number(a.savingsAmount || 0),
          Math.max(0, bal),
        );
        calculatedTotalNetWorth! += bal - savings;
        calculatedExcludedNetWorth! += savings;
      }
    });
  }

  const netWorth = calculatedTotalNetWorth ?? (summary?.totalNetWorth || 0);
  const excludedNetWorth =
    calculatedExcludedNetWorth ?? (summary?.excludedNetWorth || 0);

  return (
    <FinancialSnapshotCard
      netWorth={netWorth}
      excludedNetWorth={excludedNetWorth}
      income={summary?.income || 0}
      expense={summary?.expense || 0}
      transfer={summary?.transfer || 0}
      adjustment={summary?.adjustment || 0}
      netChange={summary?.net || 0}
      hasAssets={Boolean(assets?.some((asset) => !asset.isArchived))}
      isPrivate={isPrivate}
      onTogglePrivacy={togglePrivacy}
      isLoading={isAssetsPending && isSummaryPending}
    />
  );
}
