import { Skeleton } from "@/shared/components/ui/skeleton";
import TransactionListSkeleton from "@/shared/components/skeletons/TransactionListSkeleton";

const SKELETON_GROUPS = Array.from({ length: 3 }, (_, index) => index);

export default function AssetPageSkeleton() {
  return (
    <div className="flex flex-col h-[calc(90dvh)] space-y-4">
      <section className="relative flex flex-col items-center justify-center mt-6">
        <Skeleton className="h-9 w-30 rounded-full mb-2" />
        <Skeleton className="h-10 w-48" />
      </section>
      <section className="mb-2 px-4">
        <Skeleton className="h-10 w-full rounded-md mb-1" />
        <Skeleton className="h-4 w-14 mb-1" />
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-8 w-1/2 rounded-md" />
          <Skeleton className="h-8 w-1/2 rounded-md" />
        </div>
      </section>
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
