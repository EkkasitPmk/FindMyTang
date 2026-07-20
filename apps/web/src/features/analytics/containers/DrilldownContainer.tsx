"use client";
import { useDrilldown } from "../hooks/drilldown.hook";
import { DrilldownSummary } from "../components/DrilldownSummary";
import { DrilldownTransactionList } from "../components/DrilldownTransactionList";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useAssets } from "@/features/assets/hooks/assets.hook";

interface DrilldownContainerProps {
  categoryId: string;
}

export const DrilldownContainer = ({ categoryId }: DrilldownContainerProps) => {
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const month = searchParams?.get("month")
    ? Number.parseInt(searchParams.get("month") as string)
    : new Date().getMonth() + 1;
  const year = searchParams?.get("year")
    ? Number.parseInt(searchParams.get("year") as string)
    : new Date().getFullYear();

  const { data, isLoading } = useDrilldown(categoryId, month, year);
  const { data: assets } = useAssets();

  return (
    <>
      {isLoading ? (
        <div className="px-4 space-y-4">
          {/* Drilldown Summary Skeleton */}
          <div className="bg-surface rounded-xl border p-4 space-y-1">
            <Skeleton className="w-24 h-4 rounded" />
            <Skeleton className="w-40 h-8 rounded-lg" />
            <Skeleton className="w-20 h-4 rounded" />

            <Skeleton className="w-32 h-6 rounded-md my-2" />

            <div className="flex h-6 w-full gap-1 mt-2">
              <Skeleton className="h-full w-2/3 rounded-md" />
              <Skeleton className="h-full w-1/3 rounded-md" />
            </div>
            <div className="flex justify-between mt-1">
              <Skeleton className="w-16 h-3 rounded" />
              <Skeleton className="w-16 h-3 rounded" />
            </div>
          </div>

          {/* Drilldown Transaction List Skeleton */}
          <div className="space-y-3">
            <div className="ml-2">
              <Skeleton className="w-28 h-4 rounded" />
            </div>
            <div className="bg-surface rounded-xl border overflow-hidden divide-y divide-border">
              {[1, 2, 3].map((i) => (
                <div
                  key={`transaction-skeleton-${i}`}
                  className="px-4 py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8.5 h-8.5 rounded-lg shrink-0" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="w-32 h-4 rounded" />
                      <Skeleton className="w-16 h-3 rounded" />
                    </div>
                  </div>
                  <Skeleton className="w-20 h-5 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col animate-in fade-in duration-300">
          <div className="px-4 space-y-4 pb-4">
            <DrilldownSummary
              summary={data!.summary}
              color={data!.category.color || "var(--chart-1)"}
            />
            <DrilldownTransactionList
              transactions={data!.transactions}
              category={data!.category}
              assets={assets}
            />
          </div>
        </div>
      )}
    </>
  );
};
