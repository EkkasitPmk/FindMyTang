"use client";
import { useState } from "react";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import { useThisMonthSummary } from "../hooks/summary.hook";
import FinancialSnapshotCard from "../components/FinancialSnapshotCard";
import type { Asset } from "@/shared/lib/types/asset.type";
import type { TodaySummaryResponse } from "../schemas/dashboard.response.schema";

export default function FinancialSnapshotContainer({
  initialAssets,
  initialSummary,
}: Readonly<{
  initialAssets?: Asset[];
  initialSummary?: TodaySummaryResponse;
}>) {
  const [isPrivate, setIsPrivate] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("findmytang_privacy_mode");
      return saved === "true";
    }
    return false;
  });

  const togglePrivacy = () => {
    setIsPrivate((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("findmytang_privacy_mode", String(next));
      }
      return next;
    });
  };

  const { data: assets, isPending: isAssetsPending } = useAssets({
    initialData: initialAssets,
  });
  const { data: summary, isPending: isSummaryPending } =
    useThisMonthSummary(initialSummary);

  const netWorth = summary?.totalNetWorth || 0;
  const income = summary?.income || 0;
  const expense = summary?.expense || 0;
  const netChange = summary?.net || 0;

  const isLoading = isAssetsPending || isSummaryPending;
  const hasAssets = Boolean(assets && assets.length > 0);

  return (
    <FinancialSnapshotCard
      netWorth={netWorth}
      income={income}
      expense={expense}
      netChange={netChange}
      hasAssets={hasAssets}
      isPrivate={isPrivate}
      onTogglePrivacy={togglePrivacy}
      isLoading={isLoading}
    />
  );
}
