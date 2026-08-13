"use client";
import { useState } from "react";
import { useAssetDistribution } from "../hooks/assets.hook";
import { AssetDistributionBar } from "../components/AssetDistributionBar";
import { AssetTypeList } from "../components/AssetTypeList";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyAssetList } from "@/shared/components/customs/EmptyAssetList";
import CreateAssetsContainer from "@/features/assets/containers/CreateAssetsContainer";

export const AssetDistributionContainer = () => {
  const { data, isLoading } = useAssetDistribution();
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>(
    {},
  );
  const [isCreateAssetOpen, setIsCreateAssetOpen] = useState(false);

  const handleToggleExpand = (type: string) => {
    setExpandedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  if (data?.distribution.length === 0) {
    return (
      <>
        <div className="px-4">
          <EmptyAssetList onAddAsset={() => setIsCreateAssetOpen(true)} />
        </div>
        {isCreateAssetOpen && (
          <CreateAssetsContainer onClose={() => setIsCreateAssetOpen(false)} />
        )}
      </>
    );
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="px-4 space-y-2">
          {/* Asset Distribution Bar Skeleton */}
          <div className="bg-surface rounded-xl border border-border p-5">
            <div className="mb-4 flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-40" />
            </div>
            <Skeleton className="h-4 w-full rounded-full mb-4" />
            <div className="flex gap-3">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>

          {/* Asset Type List Skeleton */}
          <div className="space-y-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-surface border border-border rounded-xl p-4 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-20 sm:w-24" />
                    <Skeleton className="h-3 w-8 sm:w-12" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-16 sm:w-20" />
                  <Skeleton className="w-4 h-4 rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (!data) return null;

    return (
      <div className="px-4 space-y-2">
        <AssetDistributionBar
          data={data.distribution}
          totalAssets={data.totalAssets}
        />
        <AssetTypeList
          data={data.distribution}
          expandedTypes={expandedTypes}
          onToggleExpand={handleToggleExpand}
        />
      </div>
    );
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar animate-in fade-in duration-300">
      {renderContent()}
    </div>
  );
};
