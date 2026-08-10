import AssetDetailContainer from "@/features/assets/containers/AssetDetailContainer";
import { getAssetsServer } from "@/features/assets/services/assets.server";
import { cookies } from "next/headers";
import type { Asset } from "@/shared/lib/types/asset.type";

export default async function AssetsPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ id?: string }> }>) {
  const [{ id }, cookieStore] = await Promise.all([searchParams, cookies()]);
  const includeDeleted = id === undefined;
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
