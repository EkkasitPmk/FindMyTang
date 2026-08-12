import { Skeleton } from "@/shared/components/ui/skeleton";

export default function TransactionPageSkeleton() {
  return (
    <div
      aria-label="Loading transaction"
      className="grid grid-cols-1 grid-rows-[79dvh_auto] animate-pulse lg:grid-rows-[86dvh_auto]"
    >
      <div className="mb-2 min-h-0 overflow-y-auto lg:m-0">
        <div className="mb-2 flex justify-center px-4">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="px-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <div className="mt-3 space-y-4">
            <div className="flex min-h-10 items-center justify-center">
              <Skeleton className="h-10 w-60 rounded-lg" />
            </div>

            <section className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <div className="grid max-h-[24dvh] grid-cols-4 gap-y-2 overflow-auto">
                {Array.from({ length: 12 }, (_, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <Skeleton className="h-10.5 w-10.5 rounded-xl" />
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <Skeleton className="h-4 w-14" />
              <div className="flex gap-2 overflow-hidden py-1">
                {Array.from({ length: 4 }, (_, index) => (
                  <Skeleton
                    key={index}
                    className="h-14 w-30 shrink-0 rounded-md"
                  />
                ))}
              </div>
            </section>

            <div className="flex items-center justify-center">
              <Skeleton className="h-5 w-28" />
            </div>
          </div>
        </div>
      </div>
      <section className="mx-4 lg:absolute lg:inset-x-0 lg:bottom-4">
        <Skeleton className="h-12 w-full rounded-xl" />
      </section>
    </div>
  );
}
