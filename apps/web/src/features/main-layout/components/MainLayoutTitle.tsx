import { MainLayoutTitleProps } from "../types/main-layout.type";
import CategoryHeaderTitle from "./CategoryHeaderTitle";

export default function MainLayoutTitle({
  pathname,
  assetName,
  currentCategory,
  t,
}: Readonly<MainLayoutTitleProps>) {
  if (pathname === "/categories") return <>{t("manageCategories")}</>;
  if (pathname === "/assets/new") return <>{t("newAssets")}</>;
  if (pathname === "/settings/account") return <>{t("account")}</>;
  if (pathname === "/settings") return <>{t("navSettings")}</>;
  if (pathname === "/assets") return <>{assetName || t("manageAssets")}</>;
  if (pathname.startsWith("/analytics/category/")) {
    return <CategoryHeaderTitle category={currentCategory} />;
  }
  return null;
}
