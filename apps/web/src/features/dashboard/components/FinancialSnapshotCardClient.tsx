"use client";
import { useState } from "react";
import FinancialSnapshotCard from "./FinancialSnapshotCard";

interface FinancialSnapshotCardClientProps {
  netWorth: number;
  income: number;
  expense: number;
  netChange: number;
  hasAssets: boolean;
}

export default function FinancialSnapshotCardClient({
  netWorth,
  income,
  expense,
  netChange,
  hasAssets,
}: Readonly<FinancialSnapshotCardClientProps>) {
  const [isPrivate, setIsPrivate] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("findmytang_privacy_mode") === "true";
  });

  const togglePrivacy = () => {
    setIsPrivate((previous) => {
      const next = !previous;
      localStorage.setItem("findmytang_privacy_mode", String(next));
      return next;
    });
  };

  return (
    <FinancialSnapshotCard
      netWorth={netWorth}
      income={income}
      expense={expense}
      netChange={netChange}
      hasAssets={hasAssets}
      isPrivate={isPrivate}
      onTogglePrivacy={togglePrivacy}
      isLoading={false}
    />
  );
}
