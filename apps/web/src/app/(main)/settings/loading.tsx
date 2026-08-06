import { Skeleton } from "@/shared/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div aria-label="Loading settings" className="px-4 py-3">
      <div className="hidden lg:block animate-pulse">
        <div className="grid gap-4 lg:gap-6 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_500px] 2xl:grid-cols-[minmax(0,1fr)_700px]">
          <div className="space-y-6">
            <div className="bg-surface rounded-md border border-border p-4 space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="size-18 rounded-full" />
                <Skeleton className="h-3 w-28" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-28 rounded-md" />
              </div>
            </div>
            <div className="bg-surface rounded-md border border-border p-4 space-y-4">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </div>
          <div className="bg-surface rounded-md border border-border p-4 space-y-5">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-11 w-full rounded-md" />
            <Skeleton className="h-11 w-full rounded-md" />
            <Skeleton className="h-11 w-full rounded-md" />
            <Skeleton className="h-11 w-full rounded-md" />
            <Skeleton className="h-11 w-full rounded-md" />
          </div>
        </div>
      </div>

      <div className="lg:hidden space-y-6 animate-pulse">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <div className="bg-surface border border-border rounded-xl p-3.5">
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <div className="bg-surface border border-border rounded-xl divide-y divide-border p-3.5 space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <div className="bg-surface border border-border rounded-xl divide-y divide-border p-3.5 space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <div className="bg-surface border border-border rounded-xl divide-y divide-border p-3.5 space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}
