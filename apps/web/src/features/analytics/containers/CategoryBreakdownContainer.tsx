"use client";
import { useState } from "react";
import { useCategoryBreakdown } from "../hooks/analytics.hook";
import { PeriodSelector } from "@/shared/components/customs/PeriodSelector";
import { TransactionSummary } from "@/shared/components/customs/TransactionSummary";
import { CategoryBreakdownChart } from "../components/CategoryBreakdownChart";
import { CategoryList } from "../components/CategoryList";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { SegmentedControl } from "@/shared/components/customs/SegmentedControl";

export const CategoryBreakdownContainer = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [type, setType] = useState<
    "EXPENSE" | "INCOME" | "TRANSFER" | "ADJUSTMENT"
  >("EXPENSE");

  const { data, isLoading } = useCategoryBreakdown(month, year, type);

  const handlePrev = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNext = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  let totalAmount = 0;
  if (data) {
    if (type === "EXPENSE") totalAmount = data.summary.expense || 0;
    else if (type === "INCOME") totalAmount = data.summary.income || 0;
    else if (type === "TRANSFER") totalAmount = data.summary.transfer || 0;
    else totalAmount = data.summary.adjust || 0;
  }

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="px-4">
        <PeriodSelector
          mode="month"
          month={month}
          year={year}
          onPrev={handlePrev}
          onNext={handleNext}
          disableNext={
            year === currentDate.getFullYear() &&
            month === currentDate.getMonth() + 1
          }
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-14 w-full rounded-none" />
          <div className="px-4">
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
          <Skeleton className="h-46 w-full rounded-none" />
          <div className="space-y-1 px-4">
            <Skeleton className="h-4 w-30 rounded-xl" />
            <Skeleton className="h-15 w-full rounded-xl" />
            <Skeleton className="h-15 w-full หrounded-xl" />
            <Skeleton className="h-15 w-full rounded-xl" />
          </div>
        </div>
      ) : (
        <>
          <div className="mb-3">
            <TransactionSummary
              className="border-b-0 shadow-none"
              income={data!.summary.income || 0}
              expense={data!.summary.expense || 0}
              transfer={data!.summary.transfer || 0}
              adjustment={data!.summary.adjust || 0}
              net={data!.summary.net || 0}
            />
          </div>

          <div className="m-0 px-4">
            <SegmentedControl
              options={[
                { value: "EXPENSE", label: "Expense" },
                { value: "INCOME", label: "Income" },
                { value: "TRANSFER", label: "Transfer" },
                { value: "ADJUSTMENT", label: "Adjustment" },
              ]}
              value={type}
              onChange={(val) =>
                setType(val as "EXPENSE" | "INCOME" | "TRANSFER" | "ADJUSTMENT")
              }
            />
          </div>

          <div className="m-0">
            <CategoryBreakdownChart
              data={data!.breakdown}
              totalAmount={totalAmount}
            />
          </div>

          <CategoryList data={data!.breakdown} />
        </>
      )}
    </div>
  );
};
