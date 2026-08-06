import { getAssetsServer } from "@/features/assets/services/assets.server";
import { getCategoriesServer } from "@/features/category/services/category.server";
import MainLayoutClientIsland from "../components/MainLayoutClientIsland";
import type { Asset } from "@/shared/lib/types/asset.type";
import type { Category } from "@/shared/lib/types/category.type";
import NavServerContainer from "@/features/nav/containers/NavServerContainer";

export default async function MainLayoutContainer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [assets, categories] = await Promise.all([
    getAssetsServer(),
    getCategoriesServer(),
  ]);

  return (
    <MainLayoutClientIsland
      initialAssets={(assets as Asset[] | null) ?? undefined}
      initialCategories={(categories as Category[] | null) ?? undefined}
      nav={<NavServerContainer />}
    >
      {children}
    </MainLayoutClientIsland>
  );
}
