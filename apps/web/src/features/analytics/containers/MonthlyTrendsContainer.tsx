"use client";
import { useState } from "react";
import { useMonthlyTrends } from "../hooks/trends.hook";
import { MonthlyTrendsChart } from "../components/MonthlyTrendsChart";
import { MonthlyTrendsTable } from "../components/MonthlyTrendsTable";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PeriodSelector } from "@/shared/components/customs/PeriodSelector";

export const MonthlyTrendsContainer = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const { data, isLoading } = useMonthlyTrends(year);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-2 mt-2">
          {/* Chart Skeleton */}
          <Skeleton className="h-50 w-full rounded-none" />

          {/* Table Skeleton */}
          <div className="bg-transparent lg:bg-surface lg:rounded-xl lg:border lg:overflow-hidden">
            {/* Desktop Header Skeleton */}
            <div className="hidden lg:grid grid-cols-6 gap-2 p-3 border-b bg-surface-secondary items-center">
              <Skeleton className="h-3 w-10" />
              <div className="flex justify-end">
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-3 w-12" />
              </div>
            </div>

            <div className="flex flex-col gap-3 px-4 lg:gap-0 lg:divide-y lg:divide-border">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-surface border border-border rounded-xl lg:border-0 lg:rounded-none lg:bg-transparent"
                >
                  {/* Mobile View Skeleton */}
                  <div className="lg:hidden p-3.5 flex flex-col gap-4 h-fit">
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <div className="flex flex-col gap-3">
                      {[1, 2, 3, 4].map((item) => (
                        <div
                          key={item}
                          className="flex justify-between items-center"
                        >
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Desktop View Skeleton */}
                  <div className="hidden lg:grid grid-cols-6 gap-2 p-3 items-center">
                    <Skeleton className="h-3 w-12" />
                    <div className="flex justify-end">
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="flex justify-end">
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="flex justify-end">
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="flex justify-end">
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="flex justify-end">
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (!data) return null;

    const validMonths = (data.months ?? []).filter(
      (item) =>
        item.income > 0 ||
        item.expense > 0 ||
        item.transfer > 0 ||
        item.adjust > 0,
    );

    const activeTypes = {
      income: validMonths.some((m) => m.income > 0),
      expense: validMonths.some((m) => m.expense > 0),
      transfer: validMonths.some((m) => m.transfer > 0),
      adjust: validMonths.some((m) => m.adjust > 0),
    };

    return (
      <div className="space-y-2 my-2">
        <MonthlyTrendsChart
          data={validMonths}
          year={data.year}
          activeTypes={activeTypes}
        />
        <div className="lg:px-4">
          <MonthlyTrendsTable data={validMonths} year={data.year} />
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar animate-in fade-in duration-300 space-y-3">
      <div className="px-4">
        <PeriodSelector
          mode="year"
          year={year}
          onPrev={() => setYear((y) => y - 1)}
          onNext={() => setYear((y) => y + 1)}
          disableNext={year >= currentYear}
        />
      </div>

      {renderContent()}
    </div>
  );
};
