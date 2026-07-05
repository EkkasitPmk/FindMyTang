import { BriefcaseBusiness, ChevronRight, Fuel, Utensils } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useState, useEffect } from "react";

const SKELETON_JOURNALS = Array.from({ length: 4 }, (_, i) => i);

export default function RecentJournalContainer() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const isLoading = !mounted; // Future: add data hook loading state here

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-medium">Recent Journal</span>
      </div>

      {isLoading ? (
        <div className="space-y-1">
          {SKELETON_JOURNALS.map((i) => (
            <div key={`journal-skeleton-${i}`} className="flex items-center justify-between border-b border-gray-200 py-2 px-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-md" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-5 w-16" />
                <ChevronRight size={18} className="text-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* UI แบบมีข้อมูล */}
          <div className="flex items-center justify-between border-b border-gray-200 py-2 px-1">
            <div className="flex items-center gap-2">
              <Utensils className="text-gray-600" size={18} />
              <span className="text-base font-normal">อาหาร</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-base text-error">- ฿ 450</span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>

      <div className="flex items-center justify-between border-b border-gray-200 py-2 px-1">
        <div className="flex items-center gap-2">
          <Utensils className="text-gray-600" size={18} />
          <span className="text-base font-normal">อาหาร</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium text-base text-error">- ฿ 450</span>
          <ChevronRight size={18} className="text-gray-400" />
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-gray-200 py-2 px-1">
        <div className="flex items-center gap-2">
          <BriefcaseBusiness className="text-gray-600" size={18} />
          <span className="text-base font-normal">เงินเดือน</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium text-base text-[#10b981]">
            + ฿ 45,000
          </span>
          <ChevronRight size={18} className="text-gray-400" />
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-gray-200 py-2 px-1">
        <div className="flex items-center gap-2">
          <Fuel className="text-gray-600" size={18} />
          <span className="text-base font-normal">น้ำมัน</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium text-base text-error">- ฿ 1,250</span>
          <ChevronRight size={18} className="text-gray-400" />
        </div>
      </div>
      {/* UI แบบมีข้อมูล */}

      {/* UI แบบไม่มีข้อมูล */}
      {/* <div className="bg-white flex flex-col items-center gap-3 py-8 rounded-md border-2 border-gray-200 border-dashed">
        <div className="flex items-center">
          <span className="bg-gray-100 p-4 rounded-full">
            <ClipboardPenLine className="text-gray-600" size={24} />
          </span>
        </div>
        <span className="text-base font-normal text-gray-600">
          Your financial timeline starts here.
        </span>
        <span className="text-base font-normal text-gray-600 text-center max-w-68">
          Log your first transaction to see your spending patterns and history
          in action.
        </span>
      </div> */}
      {/* UI แบบไม่มีข้อมูล */}
        </>
      )}
    </section>
  );
}
