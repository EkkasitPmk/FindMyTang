import { Suspense } from "react";
import AssetPageSkeleton from "@/features/assets/components/AssetPageSkeleton";
import ManageAssetsSkeleton from "@/features/assets/components/ManageAssetsSkeleton";
import AssetsRouteContainer from "@/features/assets/containers/AssetsRouteContainer";

export default async function AssetsPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ id?: string }> }>) {
  const { id } = await searchParams;

  return (
    <Suspense
      fallback={
        id === undefined ? <ManageAssetsSkeleton /> : <AssetPageSkeleton />
      }
    >
      <AssetsRouteContainer assetId={id} />
    </Suspense>
  );
}
