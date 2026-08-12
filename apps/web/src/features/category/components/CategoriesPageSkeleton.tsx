import { Skeleton } from "@/shared/components/ui/skeleton";

export default function CategoriesPageSkeleton() {
  return (
    <div
      aria-label="Loading categories"
      className="space-y-1 px-4 py-2 animate-pulse"
    >
      <div className="mb-1 space-y-1">
        <Skeleton className="h-7 w-58" />
        <Skeleton className="h-5 w-72 max-w-full" />
      </div>
      <Skeleton className="h-11 w-full rounded-xl" />
      <div className="grid max-h-[74dvh] grid-cols-3 gap-2 overflow-hidden p-1 md:max-h-screen">
        {Array.from({ length: 12 }, (_, index) => (
          <div
            key={index}
            className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border border-border p-3.5"
          >
            <Skeleton className="size-8 rounded-lg" />
            <Skeleton className="h-3.5 w-16 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
