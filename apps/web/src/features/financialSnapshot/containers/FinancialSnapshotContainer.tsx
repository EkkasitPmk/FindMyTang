import { ArrowUp } from "lucide-react";

export default function FinancialSnapshotContainer() {
  return (
    <>
      {/* UI แบบนี้ข้อมูล */}
      <div className="flex flex-col px-3 py-4 bg-white rounded-md border border-gray-300 gap-2">
        <span className="text-xs font-medium uppercase tracking-widest">
          FINANCIAL SNAPSHOT
        </span>
        <span className="text-3xl font-bold">฿ 93,000</span>
        <div className="flex items-center gap-1">
          <ArrowUp className="text-[#10b981]" size={16} />
          <span className="text-sm text-[#10b981] font-medium">
            +2,000 This month
          </span>
        </div>
      </div>

      {/* empty state UI */}
      {/* <div className="flex flex-col px-3 py-4 bg-white rounded-md border border-gray-300 gap-2">
        <span className="text-xs font-medium uppercase tracking-widest">
          FINANCIAL SNAPSHOT
        </span>
        <span className="text-3xl font-bold">฿ 0</span>
        <div className="flex items-center gap-1">
          <span className="text-sm text-primary font-medium">
            Start recording your transactions.
          </span>
        </div>
      </div> */}
    </>
  );
}
