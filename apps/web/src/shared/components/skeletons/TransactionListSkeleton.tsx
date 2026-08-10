import { Skeleton } from "../ui/skeleton";

export default function TransactionListSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between px-4 pb-2">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-5 w-22" />
      </div>
      <div className="flex h-13 items-center gap-3 px-4 py-2">
        <Skeleton className="size-9.5 shrink-0 rounded-lg" />
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex items-center justify-end gap-1">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="size-4 rounded" />
          </div>
        </div>
      </div>
    </>
  );
}
