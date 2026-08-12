import { Skeleton } from "@/shared/components/ui/skeleton";

export default function DrilldownPageSkeleton() {
  return (
    <div
      aria-label="Loading analytics detail"
      className="flex flex-col animate-pulse"
    >
      <div className="space-y-4 px-4 py-2 pb-4">
        <div className="rounded-xl border border-border bg-surface px-4 py-3">
          <Skeleton className="h-4.5 w-28" />
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
            <div key={groupIndex}>
              <Skeleton className="mb-2 ml-2 h-5 w-32" />
              <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
                {Array.from({ length: rowCount }, (_, rowIndex) => (
                  <div
                    key={rowIndex}
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
