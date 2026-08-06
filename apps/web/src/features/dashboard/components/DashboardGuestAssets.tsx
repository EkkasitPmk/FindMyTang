"use client";
import { useState } from "react";
import ListAssetsContainer from "@/features/assets/containers/ListAssetsContainer";
import CreateAssetsContainer from "@/features/assets/containers/CreateAssetsContainer";
import type { Asset } from "@/shared/lib/types/asset.type";

export default function DashboardGuestAssets({
  initialAssets,
}: Readonly<{ initialAssets?: Asset[] }>) {
  const [isCreateAssetOpen, setIsCreateAssetOpen] = useState(false);

  return (
    <>
      <ListAssetsContainer
        initialAssets={initialAssets}
        onAddAsset={() => setIsCreateAssetOpen(true)}
      />
      {isCreateAssetOpen && (
        <CreateAssetsContainer onClose={() => setIsCreateAssetOpen(false)} />
      )}
    </>
  );
}
