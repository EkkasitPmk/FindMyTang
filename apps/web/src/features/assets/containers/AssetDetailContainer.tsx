"use client";
import {
  ArrowRightLeft,
  ChevronRight,
  Coffee,
  Pencil,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAssets } from "../hooks/assets.hook";
import EditAssetsContainer from "./EditAssetsContainer";
import { AssetType } from "../types/assets.type";

export default function AssetDetailContainer() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { data: assets, isLoading } = useAssets();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Get the specified asset or fallback to the first one
  const asset = assets?.find((a) => a.id === id) || assets?.[0];

  if (isLoading) {
    return (
      <div className="flex flex-col h-[calc(100dvh-100px)] items-center justify-center">
        <p className="text-gray-500">Loading asset...</p>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex flex-col h-[calc(100dvh-100px)] items-center justify-center">
        <p className="text-gray-500">No asset found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-100px)]">
      <div className="flex flex-col items-center justify-center my-4">
        <p className="text-gray-500 font-medium">{asset.name}</p>
        <div
          className="flex items-center gap-1 mt-1"
          style={{ color: asset.color || "#000" }}
        >
          <span className="text-2xl font-bold">฿</span>
          <p className="text-3xl font-bold">
            {asset.balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between my-2">
        <p>Recent Transactions</p>
        <ChevronRight size={18} />
      </div>

      <div className="flex-1 overflow-y-auto pb-14">
        <div className="bg-white rounded-md border border-border">
          <div className="flex items-center justify-between border-b border-border p-2">
            <div className="flex items-center gap-3">
              <span className="bg-green-200/90 rounded-full p-2">
                <Plus size={18} className="text-green-600" />
              </span>
              <div className="flex flex-col leading-5">
                <span className="text-base">Salary</span>
                <span className="text-sm text-gray-500">Sep 15</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base text-green-600">+฿65,000.00 </span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
          <div className="flex items-center justify-between p-2 border-border border-b">
            <div className="flex items-center gap-3">
              <span className="bg-red-200/90 rounded-full p-2">
                <Coffee size={18} className="text-red-600" />
              </span>
              <div className="flex flex-col leading-5">
                <span className="text-base">Starbucks</span>
                <span className="text-sm text-gray-500">Sep 14</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base text-red-600">-฿185.00 </span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
          <div className="flex items-center justify-between p-2 border-border border-b">
            <div className="flex items-center gap-3">
              <span className="bg-red-200/90 rounded-full p-2">
                <Coffee size={18} className="text-red-600" />
              </span>
              <div className="flex flex-col leading-5">
                <span className="text-base">Starbucks</span>
                <span className="text-sm text-gray-500">Sep 14</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base text-red-600">-฿185.00 </span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
          <div className="flex items-center justify-between p-2 border-border border-b">
            <div className="flex items-center gap-3">
              <span className="bg-red-200/90 rounded-full p-2">
                <Coffee size={18} className="text-red-600" />
              </span>
              <div className="flex flex-col leading-5">
                <span className="text-base">Starbucks</span>
                <span className="text-sm text-gray-500">Sep 14</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base text-red-600">-฿185.00 </span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
          <div className="flex items-center justify-between p-2 border-border border-b">
            <div className="flex items-center gap-3">
              <span className="bg-red-200/90 rounded-full p-2">
                <Coffee size={18} className="text-red-600" />
              </span>
              <div className="flex flex-col leading-5">
                <span className="text-base">Starbucks</span>
                <span className="text-sm text-gray-500">Sep 14</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base text-red-600">-฿185.00 </span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
          <div className="flex items-center justify-between p-2 border-border border-b">
            <div className="flex items-center gap-3">
              <span className="bg-red-200/90 rounded-full p-2">
                <Coffee size={18} className="text-red-600" />
              </span>
              <div className="flex flex-col leading-5">
                <span className="text-base">Starbucks</span>
                <span className="text-sm text-gray-500">Sep 14</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base text-red-600">-฿185.00 </span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
          <div className="flex items-center justify-between p-2 border-border border-b">
            <div className="flex items-center gap-3">
              <span className="bg-red-200/90 rounded-full p-2">
                <Coffee size={18} className="text-red-600" />
              </span>
              <div className="flex flex-col leading-5">
                <span className="text-base">Starbucks</span>
                <span className="text-sm text-gray-500">Sep 14</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base text-red-600">-฿185.00 </span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
          <div className="flex items-center justify-between p-2 border-border border-b">
            <div className="flex items-center gap-3">
              <span className="bg-red-200/90 rounded-full p-2">
                <Coffee size={18} className="text-red-600" />
              </span>
              <div className="flex flex-col leading-5">
                <span className="text-base">Starbucks</span>
                <span className="text-sm text-gray-500">Sep 14</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base text-red-600">-฿185.00 </span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
          <div className="flex items-center justify-between p-2 border-border border-b">
            <div className="flex items-center gap-3">
              <span className="bg-red-200/90 rounded-full p-2">
                <Coffee size={18} className="text-red-600" />
              </span>
              <div className="flex flex-col leading-5">
                <span className="text-base">Starbucks</span>
                <span className="text-sm text-gray-500">Sep 14</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base text-red-600">-฿185.00 </span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
          <div className="flex items-center justify-between p-2 border-border border-b">
            <div className="flex items-center gap-3">
              <span className="bg-red-200/90 rounded-full p-2">
                <Coffee size={18} className="text-red-600" />
              </span>
              <div className="flex flex-col leading-5">
                <span className="text-base">Starbucks</span>
                <span className="text-sm text-gray-500">Sep 14</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base text-red-600">-฿185.00 </span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
          <div className="flex items-center justify-between p-2 border-border border-b">
            <div className="flex items-center gap-3">
              <span className="bg-red-200/90 rounded-full p-2">
                <Coffee size={18} className="text-red-600" />
              </span>
              <div className="flex flex-col leading-5">
                <span className="text-base">Starbucks</span>
                <span className="text-sm text-gray-500">Sep 14</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base text-red-600">-฿185.00 </span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
          <div className="flex items-center justify-between p-2 border-border border-b">
            <div className="flex items-center gap-3">
              <span className="bg-red-200/90 rounded-full p-2">
                <Coffee size={18} className="text-red-600" />
              </span>
              <div className="flex flex-col leading-5">
                <span className="text-base">Starbucks</span>
                <span className="text-sm text-gray-500">Sep 14</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base text-red-600">-฿185.00 </span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
          <div className="flex items-center justify-between p-2 border-border border-b">
            <div className="flex items-center gap-3">
              <span className="bg-red-200/90 rounded-full p-2">
                <Coffee size={18} className="text-red-600" />
              </span>
              <div className="flex flex-col leading-5">
                <span className="text-base">Starbucks</span>
                <span className="text-sm text-gray-500">Sep 14</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base text-red-600">-฿185.00 </span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
          <div className="flex items-center justify-between p-2 border-border border-b">
            <div className="flex items-center gap-3">
              <span className="bg-red-200/90 rounded-full p-2">
                <Coffee size={18} className="text-red-600" />
              </span>
              <div className="flex flex-col leading-5">
                <span className="text-base">Starbucks</span>
                <span className="text-sm text-gray-500">Sep 14</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base text-red-600">-฿185.00 </span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-3">
              <span className="bg-red-200/90 rounded-full p-2">
                <Coffee size={18} className="text-red-600" />
              </span>
              <div className="flex flex-col leading-5">
                <span className="text-base">Starbucks</span>
                <span className="text-sm text-gray-500">Sep 14</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base text-red-600">-฿185.00 </span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      {/* nav action bottom */}
      <div className="fixed bottom-0 right-0 left-0 py-4 px-4 border-t border-border bg-white">
        <div className="flex gap-3">
          <button className="w-[25%] flex flex-col items-center justify-center border border-border py-2 rounded-md">
            <ArrowRightLeft size={18} />
            <span className="text-sm">Transfer</span>
          </button>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="w-[25%] flex flex-col items-center justify-center border border-border py-2 rounded-md cursor-pointer hover:bg-gray-50"
          >
            <Pencil size={18} />
            <span className="text-sm">Edit</span>
          </button>
          <button className="w-[50%] bg-blue-500 text-white text-base font-medium rounded-md cursor-pointer hover:bg-blue-600 transition-colors">
            Add Transaction
          </button>
        </div>
      </div>

      {isEditModalOpen && asset && (
        <EditAssetsContainer
          asset={asset}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}
