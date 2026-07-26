import { Skeleton } from "../ui/skeleton";

export default function TransactionListSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-6 w-32 mx-4" />
          <Skeleton className="h-4 w-32 mx-4" />
        </div>
        <Skeleton className="h-4 w-22 mx-4" />
      </div>
      <Skeleton className="h-13 w-full rounded-none" />
    </>
  );
}
