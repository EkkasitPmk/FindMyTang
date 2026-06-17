"use client";
import SummaryCard from "../components/SummaryCard";
import { useTodaySummary } from "../hooks/summary.hook";

export default function SummaryContainer() {
  const { data: summary, isLoading, isError } = useTodaySummary();

  return (
    <SummaryCard summary={summary} isLoading={isLoading} isError={isError} />
  );
}
