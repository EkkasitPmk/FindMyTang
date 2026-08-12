import { Skeleton } from "@/shared/components/ui/skeleton";

const SKELETON_ITEMS = Array.from({ length: 4 }, (_, index) => index);

export default function ManageAssetsSkeleton() {
  return (
    <section className="px-4 my-2 space-y-1">
      {SKELETON_ITEMS.map((index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-surface px-3 py-2.5 rounded-lg border-l-4 border-border"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-9.5 w-9.5 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
    </section>
  );
}
