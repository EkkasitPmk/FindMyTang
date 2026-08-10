import { Skeleton } from "@/shared/components/ui/skeleton";
import TransactionListSkeleton from "@/shared/components/skeletons/TransactionListSkeleton";
import { ChevronRight } from "lucide-react";

const ASSET_ROWS = [0, 1, 2];
const RECENT_JOURNAL_GROUPS = [0, 1, 2];

export default function DashboardLoading() {
  return (
    <div className="space-y-4" aria-label="Loading dashboard">
      <header className="bg-background fixed md:hidden top-0 z-40 w-full flex items-center px-4 py-2">
        <div className="flex items-center gap-2">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </header>

      <div className="px-4">
        <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-4.5 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="size-7 rounded-lg" />
          </div>
          <div className="mb-3">
            <Skeleton className="h-3 w-16 mb-1.5" />
            <Skeleton className="h-9 w-44" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Skeleton className="h-13.5 rounded-lg" />
            <Skeleton className="h-13.5 rounded-lg" />
          </div>
          <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="size-7 rounded-full" />
        </div>
        <div className="space-y-1">
          {ASSET_ROWS.map((row) => (
            <div
              key={row}
              className="flex items-center justify-between bg-surface px-3 py-2 rounded-lg cursor-pointer hover:bg-surface-secondary transition-colors border-l-4 border-border"
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
                <ChevronRight size={18} className="text-disabled-text" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-2 px-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <section className="space-y-4">
          {RECENT_JOURNAL_GROUPS.map((group) => (
            <div
              key={`recent-journal-skeleton-group-${group}`}
              className="my-1 mb-3 space-y-1"
            >
              <TransactionListSkeleton />
            </div>
          ))}
        </section>
      </section>
    </div>
  );
}
