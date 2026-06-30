import { Skeleton } from "@/shared/components/ui/skeleton";

const SKELETON_CATEGORIES = [
  "cat-1",
  "cat-2",
  "cat-3",
  "cat-4",
  "cat-5",
  "cat-6",
  "cat-7",
  "cat-8",
];
const SKELETON_ASSETS = ["asset-1", "asset-2", "asset-3"];

export default function TransactionSkeleton() {
  return (
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <header className="flex items-center justify-center relative h-10">
        <Skeleton className="h-8 w-48 rounded-md" />
      </header>

      <div className="px-4 relative h-136">
        {/* Segmented Control */}
        <Skeleton className="h-10 w-full rounded-lg" />

        {/* Currency Input */}
        <section className="flex flex-col items-center gap-1 relative py-3">
          <Skeleton className="h-12 w-[90%] rounded-lg" />
        </section>

        {/* TransactionCategoryList - Mocking a grid of items */}
        <div>
          <Skeleton className="h-4 w-20 rounded" />
          <div className="grid grid-cols-4 place-items-center py-2 gap-y-2">
            {SKELETON_CATEGORIES.map((id) => (
              <div key={id} className="flex flex-col items-center gap-1">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-16 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* TransactionAssetList - Mocking a list */}
        <div className="space-y-1.5 mt-9.5">
          <Skeleton className="h-5 w-14 rounded" />
          <div className="flex gap-3 overflow-hidden">
            {SKELETON_ASSETS.map((id) => (
              <Skeleton key={id} className="h-14 w-30 shrink-0 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <section className="absolute bottom-0 left-0 right-0 mx-4 bg-background pt-2 z-10">
          <Skeleton className="h-13 w-full rounded-xl" />
        </section>
      </div>
    </div>
  );
}
