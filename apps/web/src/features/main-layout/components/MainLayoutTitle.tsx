import { MainLayoutTitleProps } from "../types/main-layout.type";
import CategoryHeaderTitle from "./CategoryHeaderTitle";

export default function MainLayoutTitle({
  route,
  assetName,
  currentCategory,
  t,
}: Readonly<MainLayoutTitleProps>) {
  if (route === "categories") return <>{t("manageCategories")}</>;
  if (route === "assetsNew") return <>{t("newAssets")}</>;
  if (route === "settingsAccount") return <>{t("profileSettings")}</>;
  if (route === "settings") return <>{t("navSettings")}</>;
  if (route === "supportContact") return <>{t("contactUsTitle")}</>;
  if (route === "supportFeedback") return <>{t("feedbackTitle")}</>;
  if (route === "assets") return <>{assetName || t("manageAssets")}</>;
  if (route === "analyticsCategory") {
    return <CategoryHeaderTitle category={currentCategory} />;
  }
  return null;
}
