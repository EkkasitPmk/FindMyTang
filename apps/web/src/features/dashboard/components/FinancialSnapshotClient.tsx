"use client";
import { useState } from "react";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import { useThisMonthSummary } from "../hooks/summary.hook";
import FinancialSnapshotCard from "./FinancialSnapshotCard";
import type { Asset } from "@/shared/lib/types/asset.type";
import type { TodaySummaryResponse } from "../schemas/dashboard.response.schema";

export default function FinancialSnapshotClient({
  initialAssets,
  initialSummary,
}: Readonly<{
  initialAssets?: Asset[];
  initialSummary?: TodaySummaryResponse;
}>) {
  const [isPrivate, setIsPrivate] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("findmytang_privacy_mode") === "true";
  });
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
      onTogglePrivacy={() => {
        setIsPrivate((previous) => {
          const next = !previous;
          localStorage.setItem("findmytang_privacy_mode", String(next));
          return next;
        });
      }}
      isLoading={isAssetsPending || isSummaryPending}
    />
  );
}
