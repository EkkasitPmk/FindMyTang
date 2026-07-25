"use client";
import { useState } from "react";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import { useThisMonthSummary } from "../hooks/summary.hook";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";
import FinancialSnapshotCard from "../components/FinancialSnapshotCard";

export default function FinancialSnapshotContainer() {
  const mounted = useMounted();
  const [isPrivate, setIsPrivate] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pocketnote_privacy_mode");
      return saved === "true";
    }
    return false;
  });

  const togglePrivacy = () => {
    setIsPrivate((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("pocketnote_privacy_mode", String(next));
      }
      return next;
    });
  };

  const { data: assets, isPending: isAssetsPending } = useAssets();
  const { data: summary, isPending: isSummaryPending } = useThisMonthSummary();

  const netWorth = summary?.totalNetWorth || 0;
  const income = summary?.income || 0;
  const expense = summary?.expense || 0;
  const netChange = summary?.net || 0;

  const isLoading = !mounted || isAssetsPending || isSummaryPending;
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
