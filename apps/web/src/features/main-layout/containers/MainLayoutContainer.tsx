import { getAssetsServer } from "@/features/assets/services/assets.server";
import { getCategoriesServer } from "@/features/category/services/category.server";
import MainLayoutClientIsland from "../components/MainLayoutClientIsland";
import MainLayoutContentClient from "../components/MainLayoutContentClient";
import MainLayoutFrame from "../components/MainLayoutFrame";
import MainLayoutHeaderClient from "../components/MainLayoutHeaderClient";
import type { Asset } from "@/shared/lib/types/asset.type";
import type { Category } from "@/shared/lib/types/category.type";
import NavServerContainer from "@/features/nav/containers/NavServerContainer";
import TransactionSheet from "@/features/transactions/components/TransactionSheet";

export default async function MainLayoutContainer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [assets, categories] = await Promise.all([
    getAssetsServer(),
    getCategoriesServer(),
  ]);

  return (
    <MainLayoutClientIsland>
      <MainLayoutFrame
        nav={<NavServerContainer />}
        transactionSheet={<TransactionSheet />}
        header={
          <MainLayoutHeaderClient
            initialAssets={(assets as Asset[] | null) ?? undefined}
            initialCategories={(categories as Category[] | null) ?? undefined}
          />
        }
        content={<MainLayoutContentClient>{children}</MainLayoutContentClient>}
      />
    </MainLayoutClientIsland>
  );
}
