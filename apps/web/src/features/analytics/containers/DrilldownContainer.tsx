"use client";
import { useDrilldown } from "../hooks/drilldown.hook";
import { DrilldownSummary } from "../components/DrilldownSummary";
import { DrilldownTransactionList } from "../components/DrilldownTransactionList";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";

interface DrilldownContainerProps {
  categoryId: string;
  month: number;
  year: number;
}

export const DrilldownContainer = ({
  categoryId,
  month,
  year,
}: DrilldownContainerProps) => {
  const { data, isLoading } = useDrilldown(categoryId, month, year);
  const { data: assets } = useAssets();

  if (isLoading) {
    return (
      <div className="flex flex-col animate-in fade-in duration-300">
        <div className="px-4 space-y-4 pb-4 py-2">
          <div className="bg-surface rounded-xl border border-border px-4 py-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-1 h-9 w-44 rounded-lg" />
            <Skeleton className="mt-1 h-4 w-24" />
            <Skeleton className="my-2 h-6 w-36 rounded-md" />
            <div className="flex h-6 w-full gap-1">
              <Skeleton className="h-full w-2/3 rounded-md" />
              <Skeleton className="h-full w-1/3 rounded-md" />
            </div>
            <div className="mt-1 flex justify-between px-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>

          <div className="space-y-3">
            {[2, 3].map((rowCount, groupIndex) => (
              <div key={`transaction-group-skeleton-${groupIndex}`}>
                <Skeleton className="mb-2 ml-2 h-4 w-32" />
                <div className="overflow-hidden rounded-xl border border-border bg-surface divide-y divide-border">
                  {Array.from({ length: rowCount }, (_, rowIndex) => (
                    <div
                      key={`transaction-skeleton-${groupIndex}-${rowIndex}`}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8.5 w-8.5 shrink-0 rounded-lg" />
                        <div className="flex min-w-0 flex-col gap-1">
                          <Skeleton className="h-4 w-32 rounded" />
                          <Skeleton className="h-4 w-16 rounded-md" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-20 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col animate-in fade-in duration-300">
      <div className="px-4 space-y-4 pb-4 py-2">
        <DrilldownSummary
          summary={data.summary}
          color={data.category?.color || "var(--chart-1)"}
        />
        <DrilldownTransactionList
          transactions={data.transactions}
          category={data.category}
          assets={assets}
        />
      </div>
    </div>
  );
};
