import { cookies } from "next/headers";
import AssetDetailContainer from "./AssetDetailContainer";
import { getAssetsServer } from "../services/assets.server";
import type { Asset } from "@/shared/lib/types/asset.type";

export default async function AssetsRouteContainer({
  assetId,
}: Readonly<{ assetId?: string }>) {
  const cookieStore = await cookies();
  const includeDeleted = assetId === undefined;
  const initialAssets = (await getAssetsServer(includeDeleted)) as
    | Asset[]
    | null;

  if (cookieStore.has("access_token") && !initialAssets) {
    throw new Error("Failed to load authenticated assets");
  }

  return (
    <AssetDetailContainer
      initialAssets={initialAssets ?? undefined}
      initialIncludeDeleted={includeDeleted}
    />
  );
}
