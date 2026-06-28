"use client";
import ShowProfileContainer from "@/features/account/containers/ShowProfileContainer";
import NavContainer from "@/features/nav/containers/NavContainer";
import TopAppBarMobile from "@/shared/components/customs/TopAppBarMobile";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { useCategoryUIStore } from "@/features/category/hooks/category.hook";
import { useTranslation } from "@/shared/lib/i18n/useTranslation";
import { cn } from "@/shared/lib/utils";
import AssetsMenuContainer from "@/features/assets/containers/AssetsMenuContainer";

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
    if (path === "/assets") return assetName || "Asset Detail";
    return "";
  };
  const mobileTitle = getMobileTitle(pathname);

  const renderRightAction = () => {
    if (pathname === "/categories") {
      return (
        <button
          type="button"
          onClick={toggleEditingList}
          className="text-sm mr-4 text-primary hover:text-primary-dark font-medium transition-colors cursor-pointer"
        >
          {isEditingList ? t("done") : t("edit")}
        </button>
      );
    }
    if (pathname === "/settings") {
      return (
        <button
          type="button"
          onClick={() => router.back()}
          className="p-1 mr-1 cursor-pointer"
        >
          <X size={24} />
        </button>
      );
    }
    if (pathname === "/assets") {
      return <AssetsMenuContainer />;
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

            <div className="px-4 py-2">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
