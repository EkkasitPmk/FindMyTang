import { Skeleton } from "@/shared/components/ui/skeleton";

export default function AccountLoading() {
  return (
    <div
      aria-label="Loading account"
      className="space-y-10 px-4 pb-18 md:space-y-4 md:pb-4 animate-pulse"
    >
      <div className="flex flex-col items-center justify-center gap-4 my-6">
        <Skeleton className="size-18 rounded-full border border-border" />
        <Skeleton className="h-3 w-28" />
      </div>
      <section className="space-y-10 md:space-y-4">
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
        <div className="space-y-4 rounded-xl border border-border p-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>
        <div className="space-y-3 rounded-xl border border-expense/20 bg-expense-light/10 p-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </section>
    </div>
  );
}
