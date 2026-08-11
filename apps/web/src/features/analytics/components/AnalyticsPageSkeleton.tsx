import { Skeleton } from "@/shared/components/ui/skeleton";

export default function AnalyticsPageSkeleton() {
  return (
    <div
      aria-label="Loading analytics"
      className="flex h-full flex-col bg-background animate-pulse"
    >
      <div className="shrink-0 bg-background px-4 pb-2 pt-1">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      <div className="flex-1 min-h-0 space-y-3 overflow-y-auto hide-scrollbar">
        <div className="relative z-10 px-4">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-14 w-full rounded-none" />
          <div className="px-4">
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
          <Skeleton className="h-52 w-full rounded-none" />
          <div className="space-y-1 px-4">
            <Skeleton className="h-4 w-30 rounded-xl mb-2" />
            <Skeleton className="h-14.5 w-full rounded-xl" />
            <Skeleton className="h-14.5 w-full rounded-xl" />
            <Skeleton className="h-14.5 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
