import { Skeleton } from "@/shared/components/ui/skeleton";

export default function AccountLoading() {
  return (
    <div aria-label="Loading account" className="animate-pulse">
      <div className="relative my-6 flex w-full flex-col items-center justify-center gap-4">
        <div className="relative">
          <Skeleton className="size-18 rounded-full border border-border" />
          <Skeleton className="absolute bottom-0 right-0 size-6 rounded-full border border-border" />
        </div>
      </div>

      <section className="space-y-10 px-4 pb-18 md:space-y-4 md:pb-4">
        <div className="space-y-1">
          <Skeleton className="mb-1 h-4 w-28 xl:border-b xl:border-border xl:pb-1" />
          <div className="xl:flex xl:gap-4">
            <div className="bg-surface rounded-b-none rounded-md border border-border p-4 xl:flex-1 xl:border-none xl:p-0">
              <div className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
            <div className="bg-surface rounded-t-none rounded-md border-t-0 border border-border p-4 xl:flex-1 xl:border-none xl:p-0">
              <div className="space-y-1">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <Skeleton className="h-4 w-20" />
          <div className="flex h-14 w-full items-center justify-between rounded-md border border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="size-4 rounded" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <div className="space-y-3 rounded-xl border border-expense/20 bg-expense-light/10 p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="mt-0.5 size-4 shrink-0 rounded" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      </section>
    </div>
  );
}
