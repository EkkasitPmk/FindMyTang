import { Skeleton } from "@/shared/components/ui/skeleton";

export function RecurringCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/70 p-4 bg-card shadow-xs">
      {/* Top Header: Icon + Name & Chips (Left) vs Price (Right) */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Skeleton className="size-11 rounded-xl shrink-0" />
          <div className="space-y-1.5 min-w-0 flex-1">
            <Skeleton className="h-4 w-28 rounded" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-3.5 w-14 rounded-md" />
              <Skeleton className="h-3.5 w-12 rounded-md" />
            </div>
          </div>
        </div>
        <div className="space-y-1 text-right shrink-0">
          <Skeleton className="h-5 w-20 rounded ml-auto" />
          <Skeleton className="h-3 w-10 rounded ml-auto" />
        </div>
      </div>

      {/* Subline Schedule Bar */}
      <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-3.5 rounded" />
          <Skeleton className="h-3 w-36 rounded" />
        </div>
        <Skeleton className="h-4 w-16 rounded-md" />
      </div>

      {/* Card Footer: (Left: Actions + Asset) ↔ (Right: Log Button) */}
      <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="size-7 rounded-lg shrink-0" />
          <div className="flex items-center gap-1">
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>
        <Skeleton className="h-8 w-24 rounded-lg shrink-0" />
      </div>
    </div>
  );
}

export default function RecurringPageSkeleton() {
  return (
    <div
      aria-label="Loading recurring expenses"
      className="min-h-screen bg-background"
    >
      <div className="mx-auto px-4 py-4 md:pt-0 space-y-4">
        {/* Summary Card Skeleton */}
        <div className="rounded-2xl border border-border/70 p-4 bg-card space-y-3">
          {/* Header */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="h-4 w-32 rounded" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3 w-48 rounded" />
          </div>

          {/* Hero */}
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-2">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-8 w-44 rounded-lg" />
          </div>

          {/* Sub-grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl border border-border/50 bg-background/50 space-y-1.5">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-5 w-24 rounded" />
            </div>
            <div className="p-2.5 rounded-xl border border-border/50 bg-background/50 space-y-1.5">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-5 w-20 rounded" />
            </div>
          </div>
        </div>

        {/* Upcoming Alert Skeleton */}
        <div className="w-full rounded-xl p-3 border border-amber-500/20 bg-amber-500/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Skeleton className="size-4 rounded-full shrink-0" />
            <Skeleton className="h-3.5 w-64 rounded" />
          </div>
          <Skeleton className="h-4 w-20 rounded shrink-0" />
        </div>

        {/* Filter Chips Skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>

        {/* List Skeleton */}
        <div className="space-y-3 pt-1">
          {[1, 2, 3].map((n) => (
            <RecurringCardSkeleton key={n} />
          ))}
        </div>
      </div>
    </div>
  );
}
