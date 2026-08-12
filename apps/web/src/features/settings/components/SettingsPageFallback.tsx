import { Skeleton } from "@/shared/components/ui/skeleton";

export default function SettingsPageFallback() {
  return (
    <div
      aria-label="Loading settings"
      className="animate-pulse px-4 py-3 md:px-0 md:py-0"
    >
      <div className="hidden lg:grid gap-4 lg:gap-6 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_500px] 2xl:grid-cols-[minmax(0,1fr)_700px]">
        <div className="space-y-6">
          <div className="bg-surface rounded-md border border-border px-4">
            <div className="my-6 flex flex-col items-center gap-4">
              <Skeleton className="size-18 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-4 pb-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-md border border-border px-4 py-4 space-y-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        </div>
        <div className="bg-surface rounded-md border border-border px-4 py-2">
          <div className="mb-2 space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-9 w-full rounded-md" />
          <div className="mt-2 grid grid-cols-3 gap-2">
            {Array.from({ length: 12 }, (_, index) => (
              <div
                key={`settings-category-skeleton-${index}`}
                className="flex h-23 flex-col items-center justify-center gap-3 rounded-lg border border-border p-4"
              >
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="h-4 w-16 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:hidden space-y-6">
        <div className="space-y-3">
          <Skeleton className="ml-1 h-3 w-24" />
          <div className="flex h-12.5 items-center justify-between rounded-xl border border-border bg-surface px-3.5">
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="size-4 rounded" />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="ml-1 h-3 w-24" />
          <div className="divide-y divide-border rounded-xl border border-border bg-surface">
            {Array.from({ length: 2 }, (_, index) => (
              <div
                key={`settings-preference-skeleton-${index}`}
                className="flex h-13 items-center justify-between px-3.5"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-lg" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-7 w-32 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
        {Array.from({ length: 2 }, (_, sectionIndex) => (
          <div
            className="space-y-3"
            key={`settings-menu-skeleton-${sectionIndex}`}
          >
            <Skeleton className="ml-1 h-3 w-24" />
            <div className="divide-y divide-border rounded-xl border border-border bg-surface">
              {Array.from({ length: 2 }, (_, itemIndex) => (
                <div
                  key={`settings-menu-item-skeleton-${sectionIndex}-${itemIndex}`}
                  className="flex h-12 items-center justify-between px-3.5"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-8 rounded-lg" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="size-4 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    </div>
  );
}
