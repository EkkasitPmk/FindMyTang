import { cookies } from "next/headers";
import AssetDetailContainer from "./AssetDetailContainer";
import { getAssetsServer } from "../services/assets.server";
import { getAvailableDatesServer } from "@/features/transactions/services/transactions.server";

export default async function AssetsRouteContainer({
  assetId,
}: Readonly<{ assetId?: string }>) {
  const cookieStore = await cookies();
  const includeDeleted = assetId === undefined;
  const [initialAssets, initialAvailableDates] = await Promise.all([
    getAssetsServer(includeDeleted),
    assetId ? getAvailableDatesServer(assetId) : Promise.resolve(null),
  ]);

  if (
    cookieStore.has("access_token") &&
    (!initialAssets || (assetId && !initialAvailableDates))
  ) {
    throw new Error("Failed to load authenticated assets");
  }

  return (
    <AssetDetailContainer
      initialAssets={initialAssets ?? undefined}
      initialIncludeDeleted={includeDeleted}
      initialAvailableDates={initialAvailableDates ?? undefined}
      initialAvailableDatesAssetId={assetId}
    />
  );
}
