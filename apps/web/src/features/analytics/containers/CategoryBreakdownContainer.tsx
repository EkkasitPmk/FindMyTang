"use client";
import { useState } from "react";
import { useCategoryBreakdown } from "../hooks/analytics.hook";
import { PeriodSelector } from "@/shared/components/customs/PeriodSelector";
import { TransactionSummary } from "@/shared/components/customs/TransactionSummary";
import { CategoryBreakdownChart } from "../components/CategoryBreakdownChart";
import { CategoryList } from "../components/CategoryList";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContents,
  TabsContent,
} from "@/shared/components/animate-ui/components/animate/tabs";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import type { CategoryBreakdownResponse } from "../schemas/analytics.response.schema";

export const CategoryBreakdownContainer = ({
  initialData,
  initialMonth,
  initialYear,
}: Readonly<{
  initialData?: CategoryBreakdownResponse;
  initialMonth?: number;
  initialYear?: number;
}>) => {
  const { t } = useTranslation();
  const currentDate = new Date();
  const [month, setMonth] = useState(
    initialMonth ?? currentDate.getMonth() + 1,
  );
  const [year, setYear] = useState(initialYear ?? currentDate.getFullYear());
  const [type, setType] = useState<"EXPENSE" | "INCOME" | "TRANSFER">(
    "EXPENSE",
  );

  const { data, isLoading } = useCategoryBreakdown(month, year, type, {
    initialData:
      type === "EXPENSE" && month === initialMonth && year === initialYear
        ? initialData
        : undefined,
  });

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
    else
      totalAmount = (data.summary.transfer || 0) + (data.summary.adjust || 0);
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-14 w-full rounded-none" />
          <div className="px-4">
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
          <Skeleton className="h-52 w-full rounded-none" />
          <div className="space-y-1 px-4">
            <Skeleton className="h-4 w-30 rounded-xl" />
            <Skeleton className="h-15 w-full rounded-xl" />
            <Skeleton className="h-15 w-full rounded-xl" />
            <Skeleton className="h-15 w-full rounded-xl" />
          </div>
        </div>
      );
    }

    if (!data) return null;

    return (
      <>
        <div className="mb-3">
          <TransactionSummary
            className="border-b-0 shadow-none"
            income={data.summary.income || 0}
            expense={data.summary.expense || 0}
            transfer={data.summary.transfer || 0}
            adjustment={data.summary.adjust || 0}
            net={data.summary.net || 0}
          />
        </div>

        <Tabs
          value={type}
          onValueChange={(val) =>
            setType(val as "EXPENSE" | "INCOME" | "TRANSFER")
          }
          className="gap-1"
        >
          <div className="m-0 px-4 relative z-10">
            <TabsList className="w-full">
              <TabsTrigger value="EXPENSE">{t("expense")}</TabsTrigger>
              <TabsTrigger value="INCOME">{t("income")}</TabsTrigger>
              <TabsTrigger value="TRANSFER">{t("transfer")}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContents className="mt-3">
            {(["EXPENSE", "INCOME", "TRANSFER"] as const).map((tVal) => (
              <TabsContent key={tVal} value={tVal} className="space-y-2">
                <CategoryBreakdownChart
                  data={data.breakdown}
                  totalAmount={totalAmount}
                />

                <CategoryList
                  data={data.breakdown}
                  month={month}
                  year={year}
                  type={tVal}
                />
              </TabsContent>
            ))}
          </TabsContents>
        </Tabs>
      </>
    );
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar space-y-3">
      <div className="px-4 relative z-10">
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

      {renderContent()}
    </div>
  );
};
