import TransactionListSkeleton from "@/shared/components/skeletons/TransactionListSkeleton";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function JournalPageSkeleton() {
  return (
    <div
      aria-label="Loading journal"
      className="flex h-full flex-col space-y-2 bg-background animate-pulse"
    >
      <div className="shrink-0 bg-background px-4 pt-1">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      <div className="flex-1 min-h-0">
        <div className="flex h-full flex-col space-y-6">
          <section className="z-10 shrink-0 space-y-4 bg-background px-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <div className="flex items-center gap-2 pb-1">
              <div className="flex flex-1 gap-2 overflow-hidden">
                <Skeleton className="h-8 w-16 shrink-0 rounded-full" />
                <Skeleton className="h-8 w-20 shrink-0 rounded-full" />
                <Skeleton className="h-8 w-18 shrink-0 rounded-full" />
                <Skeleton className="h-8 w-22 shrink-0 rounded-full" />
              </div>
              <Skeleton className="size-8 shrink-0 rounded-md" />
            </div>
          </section>
          <div className="flex-1 min-h-0 space-y-4">
            <TransactionListSkeleton />
            <TransactionListSkeleton />
            <TransactionListSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
