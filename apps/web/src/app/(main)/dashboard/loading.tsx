import { Skeleton } from "@/shared/components/ui/skeleton";
import TransactionListSkeleton from "@/shared/components/skeletons/TransactionListSkeleton";
import DashboardAssetSkeleton from "@/features/assets/components/DashboardAssetSkeleton";

const RECENT_JOURNAL_GROUPS = [0, 1, 2];

export default function DashboardLoading() {
  return (
    <>
      {/* Mobile Profile Header Skeleton - matches ShowProfileContainer */}
      <header className="bg-background fixed md:hidden top-0 z-40 w-full flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-2">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </header>

      <div className="space-y-4" aria-label="Loading dashboard">
        {/* Financial Snapshot Card Skeleton - matches FinancialSnapshotCard */}
        <div className="px-4">
          <div className="relative overflow-hidden rounded-xl border border-border bg-surface py-4.5 sm:py-5 shadow-sm">
            <div className="flex items-center justify-between mb-2 px-4.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="size-7 rounded-lg" />
            </div>
            <div className="mb-3 px-4.5">
              <Skeleton className="h-3 w-16 mb-1.5" />
              <Skeleton className="h-9 w-44" />
            </div>
            <div className="flex gap-2.5 overflow-x-auto hide-scrollbar px-4.5">
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton
                  key={index}
                  className="h-15 w-[42%] shrink-0 rounded-lg"
                />
              ))}
            </div>
            <div className="mt-3 pt-2.5 px-4.5 border-t border-border/50 flex items-center justify-between">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        {/* Asset Section Skeleton - matches DashboardAssetHeader & ListAssetsContainer */}
        <div className="px-4 space-y-4">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-6 w-28" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-14 rounded-lg" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <DashboardAssetSkeleton />
        </div>

        {/* Recent Journal Section Skeleton - matches RecentJournalContainer */}
        <section className="mt-5.5">
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
    </>
  );
}
