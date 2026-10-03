import { Skeleton } from "@/shared/components/ui/skeleton";
import TransactionListSkeleton from "@/shared/components/skeletons/TransactionListSkeleton";

const SKELETON_GROUPS = Array.from({ length: 3 }, (_, index) => index);
const SKELETON_FLOW_CARDS = Array.from({ length: 3 }, (_, index) => index);

export default function AssetPageSkeleton() {
  return (
    <div className="relative flex flex-col h-full space-y-4">
      {/* Top Balance Card Skeleton */}
      <section className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface py-4.5 sm:py-5 shadow-sm space-y-3.5">
          {/* Row 1: Badge (left) & Month/Year Selectors (right) */}
          <div className="flex items-center justify-between gap-2 px-4.5 sm:px-5">
            <Skeleton className="h-6 w-24 rounded-full" />
            <div className="flex items-center gap-1.5 shrink-0">
              <Skeleton className="h-8 w-29 sm:w-31 rounded-lg" />
              <Skeleton className="h-8 w-19 sm:w-21 rounded-lg" />
            </div>
          </div>

          {/* Row 2: Balance Amount */}
          <div className="px-4.5 sm:px-5 pt-0.5">
            <Skeleton className="h-9 sm:h-10 w-44 rounded-md" />
          </div>

          {/* Row 3: Split Cards (Income, Expense, Transfer, Adjustment) */}
          <div className="flex gap-2.5 overflow-hidden px-4.5 sm:px-5">
            {SKELETON_FLOW_CARDS.map((index) => (
              <Skeleton
                key={index}
                className="h-16 w-[42%] shrink-0 rounded-lg"
              />
            ))}
          </div>

          {/* Row 4: Net Cash Flow Footer */}
          <div className="pt-2.5 px-4.5 sm:px-5 border-t border-border/50 flex items-center justify-between">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </section>

      {/* Inline View Option ("Recent Transactions ˅") Skeleton */}
      <section className="px-4">
        <Skeleton className="h-6 w-44 rounded-md" />
      </section>

      {/* Transactions List Skeleton */}
      <section className="flex-1 space-y-4 overflow-hidden">
        {SKELETON_GROUPS.map((index) => (
          <div key={index} className="space-y-1 my-2">
            <TransactionListSkeleton />
          </div>
        ))}
      </section>
    </div>
  );
}
