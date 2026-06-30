import { BriefcaseBusiness, ChevronRight, Fuel, Utensils } from "lucide-react";

export default function RecentJournalContainer() {
  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-medium">Recent Journal</span>
        {/* ปุ่มนี้ยังคงคิดอยู่ว่ามีดีไหม?? หรือใส่เป็นการสลับสับเปลี่ยน layout ใหม่ แบบ list หรือ grid *ห้ามเอาออกหรือลบทิ้ง*/}
        {/* <div className="flex items-center gap-1">
            <span className="text-sm text-primary">View all assets</span>
            <ArrowRight size={16} className="text-primary" />
          </div> */}
        {/* ปุ่มนี้ยังคงคิดอยู่ว่ามีดีไหม?? หรือใส่เป็นการสลับสับเปลี่ยน layout ใหม่ แบบ list หรือ grid *ห้ามเอาออกหรือลบทิ้ง*/}
      </div>

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
    </section>
  );
}
