import AssetDetailContainer from "@/features/assets/containers/AssetDetailContainer";
import { getAssetsServer } from "@/features/assets/services/assets.server";
import type { Asset } from "@/shared/lib/types/asset.type";

export default async function AssetsPage() {
  const initialAssets = (await getAssetsServer()) as Asset[] | null;

  return <AssetDetailContainer initialAssets={initialAssets ?? undefined} />;
}
