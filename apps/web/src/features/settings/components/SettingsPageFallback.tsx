import { Skeleton } from "@/shared/components/ui/skeleton";

export default function SettingsPageFallback() {
  return (
    <div aria-label="Loading settings" className="px-4 py-3 animate-pulse">
      <div className="hidden lg:grid gap-4 lg:gap-6 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_500px] 2xl:grid-cols-[minmax(0,1fr)_700px]">
        <div className="space-y-6">
          <div className="bg-surface rounded-md border border-border p-4 space-y-6">
            <Skeleton className="mx-auto size-18 rounded-full" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
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
        </div>
      </div>
      <div className="lg:hidden space-y-6">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  );
}
