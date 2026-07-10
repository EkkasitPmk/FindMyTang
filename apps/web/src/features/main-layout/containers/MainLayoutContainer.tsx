"use client";
import { useState } from "react";
import ShowProfileContainer from "@/features/account/containers/ShowProfileContainer";
import NavContainer from "@/features/nav/containers/NavContainer";
import TopAppBarMobile from "@/shared/components/customs/TopAppBarMobile";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X, Plus } from "lucide-react";
import { useCategoryUIStore } from "@/features/category/hooks/category.hook";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { cn } from "@/shared/lib/utils/core.util";
import AssetsMenuContainer from "@/features/assets/containers/AssetsMenuContainer";
import CreateAssetsContainer from "@/features/assets/containers/CreateAssetsContainer";
import { useAssetUIStore } from "@/features/assets/hooks/assets.hook";
import { Button } from "@/shared/components/customs/Button";

export default function MainLayoutContainer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assetName = searchParams.get("name");
  const isEditingList = useCategoryUIStore((state) => state.isEditingList);
  const toggleEditingList = useCategoryUIStore(
    (state) => state.toggleEditingList,
  );

  const isEditingAssets = useAssetUIStore((state) => state.isEditingList);
  const toggleEditingAssets = useAssetUIStore(
    (state) => state.toggleEditingList,
  );
  const hasAssets = useAssetUIStore((state) => state.hasAssets);
  const [isCreateAssetModalOpen, setIsCreateAssetModalOpen] = useState(false);

  const { t } = useTranslation();

  const isMainTab = [
    "/home",
    "/journal",
    "/analytics",
    "/transaction",
  ].includes(pathname);
  const shouldShowTopAppBar = !isMainTab;

  const getMobileTitle = (path: string) => {
    if (path === "/categories") return t("manageCategories");
    if (path === "/assets/new") return t("newAssets");
    if (path === "/settings/account") return t("account");
    if (path === "/settings") return t("navSettings");
    if (path === "/assets") return assetName || "Manage Assets";
    return "";
  };
  const mobileTitle = getMobileTitle(pathname);

  const renderRightAction = () => {
    if (pathname === "/categories") {
      return (
        <Button
          variant="unstyled"
          type="button"
          onClick={toggleEditingList}
          className="text-sm mr-4 text-primary hover:text-primary-dark font-medium transition-colors cursor-pointer"
        >
          {isEditingList ? t("done") : t("edit")}
        </Button>
      );
    }
    if (pathname === "/settings") {
      return (
        <Button
          variant="unstyled"
          type="button"
          onClick={() => router.back()}
          className="p-1 mr-1 cursor-pointer"
        >
          <X size={24} />
        </Button>
      );
    }
    if (pathname === "/assets") {
      if (mobileTitle === assetName) {
        return <AssetsMenuContainer />;
      }

      if (!hasAssets) {
        return (
          <Button
            variant="unstyled"
            type="button"
            onClick={() => setIsCreateAssetModalOpen(true)}
            className="p-1 mr-2 text-primary hover:text-primary-dark cursor-pointer"
          >
            <Plus size={20} />
          </Button>
        );
      }

      return (
        <Button
          variant="unstyled"
          type="button"
          onClick={toggleEditingAssets}
          className="text-sm mr-3 text-primary hover:text-primary-dark font-medium transition-colors cursor-pointer"
        >
          {isEditingAssets ? t("done") : t("edit")}
        </Button>
      );
    }
    return null;
  };

  let mainContentClassName = "px-0 py-3 md:p-8";
  if (isMainTab) {
    if (pathname === "/transaction") {
      mainContentClassName = cn("md:p-8 pb-20", "py-3");
    } else {
      mainContentClassName = cn("md:p-8 pb-20", "py-3 pt-15");
    }
  }

  return (
    <div className="text-primary-text flex flex-col font-sans relative overflow-x-hidden flex-1">
      {/* Subtle brand color glow - very light opacity, surgical accent */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-primary-light/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] rounded-full bg-accent-light/10 blur-[120px] pointer-events-none" />

      {/* Main Shell Container */}
      <div className="flex flex-1 relative z-10">
        {/* Navigation components (Sidebar, Drawer, Bottom Nav, Modals) */}
        <NavContainer />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {isMainTab && pathname !== "/transaction" && <ShowProfileContainer />}

          {/* Child Content */}
          <main
            className={cn(
              "flex-1 overflow-y-auto max-h-screen w-full mx-auto md:pb-8",
              mainContentClassName,
            )}
          >
            {shouldShowTopAppBar && (
              <TopAppBarMobile
                title={mobileTitle}
                showBackButton={pathname !== "/settings"}
                onBack={() => router.back()}
                rightAction={renderRightAction()}
              />
            )}

            {children}

            {isCreateAssetModalOpen && (
              <CreateAssetsContainer
                onClose={() => setIsCreateAssetModalOpen(false)}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
