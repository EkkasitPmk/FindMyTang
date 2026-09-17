"use client";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import DashboardAssetActions from "./DashboardAssetActions";
import DashboardAssetTitle from "./DashboardAssetTitle";
import type { Language } from "@/shared/lib/configs/translations.config";
import type { Asset } from "@/shared/lib/types/asset.type";

export default function DashboardAssetHeader({
  language,
  initialAssets,
  isLoading: propIsLoading,
}: Readonly<{
  language: Language;
  initialAssets?: Asset[];
  isLoading?: boolean;
}>) {
  const { data: currentAssets = initialAssets, isPending } = useAssets({
    initialData: initialAssets,
  });

  const isLoading = propIsLoading ?? (isPending && !currentAssets);

  if (isLoading) {
    return (
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="size-6.5 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mb-2">
      <DashboardAssetTitle language={language} />
      <DashboardAssetActions />
    </div>
  );
}
