import {
  ChevronRight,
  HandCoins,
  Landmark,
  Link2,
  TrendingUp,
  Wallet,
} from "lucide-react";

export default function ListAssetsContainer() {
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-medium">Assets</span>
          {/* ปุ่มนี้ยังคงคิดอยู่ว่ามีดีไหม?? หรือใส่เป็นการสลับสับเปลี่ยน layout ใหม่ แบบ list หรือ grid *ห้ามเอาออกหรือลบทิ้ง*/}
          {/* <div className="flex items-center gap-1">
            <span className="text-sm text-primary">View all assets</span>
            <ArrowRight size={16} className="text-primary" />
          </div> */}
          {/* ปุ่มนี้ยังคงคิดอยู่ว่ามีดีไหม?? หรือใส่เป็นการสลับสับเปลี่ยน layout ใหม่ แบบ list หรือ grid *ห้ามเอาออกหรือลบทิ้ง*/}
        </div>

        {/* UI แบบนี้ข้อมูล */}
        <div className="space-y-1">
          <div className="flex items-center justify-between bg-white p-3 rounded-sm">
            <div className="flex items-center gap-2">
              <span className="bg-gray-100 p-2 rounded-full">
                <Landmark className="text-gray-600" size={18} />
              </span>
              <span className="text-base font-medium">SCB</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-base">฿ 42,075</span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>

          <div className="flex items-center justify-between bg-white p-3 rounded-sm">
            <div className="flex items-center gap-2">
              <span className="bg-gray-100 p-2 rounded-full">
                <Wallet className="text-gray-600" size={18} />
              </span>
              <span className="text-base font-medium">KBank</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-base">฿ 15,425</span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>

          <div className="flex items-center justify-between bg-white p-3 rounded-sm">
            <div className="flex items-center gap-2">
              <span className="bg-gray-100 p-2 rounded-full">
                <TrendingUp className="text-gray-600" size={18} />
              </span>
              <span className="text-base font-medium">Stocks</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-base">฿ 31,000</span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>

          <div className="flex items-center justify-between bg-white p-3 rounded-sm">
            <div className="flex items-center gap-2">
              <span className="bg-gray-100 p-2 rounded-full">
                <HandCoins className="text-gray-600" size={18} />
              </span>
              <span className="text-base font-medium">Cash</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-base">฿ 5,000</span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
        </div>
        {/* UI แบบนี้ข้อมูล */}

        {/* UI แบบไม่มีข้อมูล */}
        <div className="bg-white flex flex-col items-center gap-3 py-8 rounded-md border-2 border-gray-200 border-dashed">
          <div className="flex items-center">
            <span className="bg-gray-100 p-4 rounded-full">
              <Landmark className="text-gray-600" size={24} />
            </span>
          </div>
          <span className="text-base font-normal text-gray-600">
            No assets linked yet
          </span>
          <div className="flex items-center gap-2 text-primary font-medium">
            <Link2 size={18} />
            <span>Add Asset</span>
          </div>
        </div>
        {/* UI แบบไม่มีข้อมูล */}

        <div className="flex gap-4">
          <div className="flex flex-col grow px-4 py-3 rounded-md border border-outline-variant/30">
            <span className="text-sm font-medium">Income</span>
            <span className="text-base font-bold">฿ 45,000</span>
          </div>
          <div className="flex flex-col grow px-4 py-3 rounded-md border border-outline-variant/30">
            <span className="text-sm font-medium">Expanse</span>
            <span className="text-base font-bold">฿ 12,000</span>
          </div>
        </div>
      </div>
    </>
  );
}
