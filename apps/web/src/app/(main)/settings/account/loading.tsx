import { Skeleton } from "@/shared/components/ui/skeleton";

export default function AccountLoading() {
  return (
    <div aria-label="Loading account" className="animate-pulse">
      <div className="relative my-6 flex w-full flex-col items-center justify-center gap-4">
        <div className="relative">
          <Skeleton className="size-18 rounded-full border border-border bg-background p-1" />
          <Skeleton className="absolute bottom-0 right-0 size-6 rounded-full border border-border bg-surface" />
        </div>
      </div>

      <section className="space-y-10.5 px-4 pb-18 md:space-y-4 md:pb-4">
        <div className="space-y-1">
          <Skeleton className="mb-2 h-4 w-28 xl:border-b xl:border-border xl:pb-1" />
          <div className="xl:flex xl:gap-4">
            <div className="bg-surface rounded-b-none rounded-md border border-border p-4 xl:flex-1 xl:border-none xl:p-0">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
            </div>
            <div className="bg-surface rounded-t-none rounded-md border-t-0 border border-border p-4 xl:flex-1 xl:border-none xl:p-0">
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-12.5 w-full rounded-md" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <Skeleton className="h-4 w-20" />
          <div className="flex h-12.5 w-full items-center justify-between rounded-md border border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="size-4 rounded" />
          </div>
        </div>

        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <div className="space-y-3 rounded-xl border border-expense/20 bg-expense-light/10 p-4">
            <div className="flex items-start gap-3 mb-4">
              <Skeleton className="mt-1 size-4 shrink-0 rounded" />
              <div className="flex flex-1 flex-col gap-1.5 pt-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      </section>
    </div>
  );
}
