"use client";
import FinancialSnapshotCard from "./FinancialSnapshotCard";
import { useFinancialSnapshotPrivacy } from "../hooks/financialSnapshotPrivacy.hook";

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
  const { isPrivate, togglePrivacy } = useFinancialSnapshotPrivacy();

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
