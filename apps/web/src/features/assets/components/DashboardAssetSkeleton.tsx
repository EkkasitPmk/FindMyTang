"use client";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useAssetUIStore } from "@/features/assets/hooks/assets.hook";

export default function DashboardAssetSkeleton() {
  const viewMode = useAssetUIStore((state) => state.dashboardAssetView);

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={`asset-grid-skeleton-${i}`}
            className="bg-surface p-2.5 rounded-xl border-t-3 border-border flex flex-col justify-between min-h-23"
          >
            <div className="flex items-center justify-between w-full">
              <Skeleton className="h-7.5 w-7.5 rounded-full" />
              <Skeleton className="h-3.5 w-12 rounded-full" />
            </div>
            <div className="space-y-2.5 mt-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {[0, 1, 2].map((row) => (
        <div
          key={`asset-skeleton-${row}`}
          className="flex items-center justify-between bg-surface px-3 py-2 rounded-lg border-l-4 border-border"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-9.5 w-9.5 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="size-4 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
