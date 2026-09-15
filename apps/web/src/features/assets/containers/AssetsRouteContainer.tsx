import AssetDetailContainer from "./AssetDetailContainer";
import { getAssetsServer } from "../services/assets.server";
import { getAvailableDatesServer } from "@/features/transactions/services/transactions.server";

export default async function AssetsRouteContainer({
  assetId,
}: Readonly<{ assetId?: string }>) {
  const includeDeleted = assetId === undefined;
  const [initialAssets, initialAvailableDates] = await Promise.all([
    getAssetsServer(includeDeleted),
    assetId ? getAvailableDatesServer(assetId) : Promise.resolve(null),
  ]);

  return (
    <AssetDetailContainer
      initialAssets={initialAssets ?? undefined}
      initialIncludeDeleted={includeDeleted}
      initialAvailableDates={initialAvailableDates ?? undefined}
      initialAvailableDatesAssetId={assetId}
    />
  );
}
