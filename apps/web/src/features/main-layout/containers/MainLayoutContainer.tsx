"use client";
import { useState } from "react";
import ShowProfileContainer from "@/features/account/containers/ShowProfileContainer";
import NavContainer from "@/features/nav/containers/NavContainer";
import TopAppBarMobile from "@/shared/components/customs/TopAppBarMobile";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X, Plus } from "lucide-react";
import { useCategories } from "@/shared/lib/hooks/useCategories.hook";
import { useCategoryUIStore } from "@/features/category/hooks/category.hook";
import { Category } from "@/shared/lib/types/category.type";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { cn } from "@/shared/lib/utils/core.util";
import { TransactionIcon } from "@/shared/components/customs/TransactionIcon";
import {
  TransactionResponse,
  TransactionType,
} from "@/shared/lib/types/transaction.type";
import { Skeleton } from "@/shared/components/ui/skeleton";
import AssetsMenuContainer from "@/features/assets/containers/AssetsMenuContainer";
import CreateAssetsContainer from "@/features/assets/containers/CreateAssetsContainer";
import { useAssetUIStore } from "@/features/assets/hooks/assets.hook";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { Input } from "@/shared/components/customs/Input";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import { SidebarProvider } from "@/shared/components/animate-ui/components/radix/sidebar";

export default function MainLayoutContainer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assetId = searchParams.get("id");
  const assetNameParam = searchParams.get("name");

  const { data: assets } = useAssets();
  const currentAsset = assets?.find((a) => a.id === assetId);
  // ponytail: prioritize URL param to allow instant optimistic UI updates from AssetDetailContainer
  const assetName = assetNameParam || currentAsset?.name;
  const isEditingList = useCategoryUIStore((state) => state.isEditingList);
  const toggleEditingList = useCategoryUIStore(
    (state) => state.toggleEditingList,
  );

  const isEditingAssets = useAssetUIStore((state) => state.isEditingList);
  const toggleEditingAssets = useAssetUIStore(
    (state) => state.toggleEditingList,
  );
  const hasAssets = useAssetUIStore((state) => state.hasAssets);
  const isSearchMode = useAssetUIStore((state) => state.isSearchMode);
  const setSearchMode = useAssetUIStore((state) => state.setSearchMode);
  const searchKeyword = useAssetUIStore((state) => state.searchKeyword);
  const setSearchKeyword = useAssetUIStore((state) => state.setSearchKeyword);
  const [isCreateAssetModalOpen, setIsCreateAssetModalOpen] = useState(false);

  const { t } = useTranslation();

  const isMainTab = [
    "/home",
    "/journal",
    "/analytics",
    "/transaction",
  ].includes(pathname);
  const shouldShowTopAppBar = !isMainTab;

  const categoryIdMatch = new RegExp(/\/analytics\/category\/(.+)/).exec(
    pathname,
  );
  const categoryId = categoryIdMatch ? categoryIdMatch[1] : null;
  const { data: categories } = useCategories();

  const getSyntheticCategory = (
    id: string | null,
  ): {
    id: string;
    name: string;
    color: string;
    icon?: string;
    type?: TransactionType;
  } | null => {
    if (!id) return null;
    if (id === "uncategorized_transfer") {
      return {
        id: "uncategorized_transfer",
        name: t("transfer"),
        color: "#3B82F6",
        type: "TRANSFER",
      };
    }
    if (id === "uncategorized_adjustment") {
      return {
        id: "uncategorized_adjustment",
        name: t("adjustment"),
        color: "#6B7280",
        type: "ADJUSTMENT",
      };
    }
    if (id === "uncategorized") {
      return {
        id: "uncategorized",
        name: "Uncategorized",
        color: "#9CA3AF",
        type: "EXPENSE",
      };
    }
    return null;
  };

  const currentCategory =
    categories?.find((c: Category) => c.id === categoryId) ||
    getSyntheticCategory(categoryId);

  const getMobileTitle = (path: string): React.ReactNode => {
    if (path === "/categories") return t("manageCategories");
    if (path === "/assets/new") return t("newAssets");
    if (path === "/settings/account") return t("account");
    if (path === "/settings") return t("navSettings");
    if (path === "/assets") return assetName || t("manageAssets");
    if (path.startsWith("/analytics/category/")) {
      if (currentCategory) {
        return (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              <TransactionIcon
                transaction={
                  {
                    type:
                      (currentCategory.type as TransactionType) || "EXPENSE",
                    category: {
                      id: currentCategory.id,
                      name: currentCategory.name,
                      icon: currentCategory.icon,
                      color: currentCategory.color || "var(--primary-text)",
                    },
                  } as TransactionResponse
                }
              />
              <span className="text-base font-bold text-primary-text leading-none">
                {currentCategory.name}
              </span>
            </div>
          </div>
        );
      }
      return (
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 mt-0.5">
            <Skeleton className="w-8.5 h-8.5 rounded-lg shrink-0" />
            <Skeleton className="w-16 h-4 rounded" />
          </div>
        </div>
      );
    }
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

  let mainContentClassName = "px-0 py-3";
  let mainOverflowClassName = "overflow-y-auto max-h-screen";
  if (isMainTab) {
    if (
      pathname === "/transaction" ||
      pathname === "/journal" ||
      pathname === "/analytics"
    ) {
      mainContentClassName = cn("py-3");
      mainOverflowClassName = "overflow-hidden h-full";
    } else {
      mainContentClassName = cn("pt-15");
    }
  } else if (shouldShowTopAppBar) {
    mainContentClassName = cn("pt-12");
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="text-primary-text flex flex-col font-sans relative flex-1 min-w-0">
        {/* Subtle brand color glow - very light opacity, surgical accent */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-primary-light/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] rounded-full bg-accent-light/10 blur-[120px] pointer-events-none" />

        {/* Main Shell Container */}
        <div className="flex flex-1 relative z-10 min-w-0">
          {/* Navigation components (Sidebar, Drawer, Bottom Nav, Modals) */}
          <NavContainer />

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {isMainTab &&
              pathname !== "/transaction" &&
              pathname !== "/journal" &&
              pathname !== "/analytics" && <ShowProfileContainer />}

            {shouldShowTopAppBar && !isSearchMode && (
              <div className="fixed w-full top-0 z-40 bg-background/80 backdrop-blur-md">
                <TopAppBarMobile
                  title={mobileTitle}
                  showBackButton={pathname !== "/settings"}
                  onBack={() => {
                    if (pathname === "/assets" && assetName) {
                      setSearchMode(false);
                      setSearchKeyword("");
                    }
                    router.back();
                  }}
                  rightAction={renderRightAction()}
                />
              </div>
            )}

            {shouldShowTopAppBar && isSearchMode && (
              <div className="sticky top-0 flex items-center px-4 pb-2 pt-2 z-40 bg-background/90 backdrop-blur-sm border-b border-border/50 h-14">
                <Input
                  autoFocus
                  placeholder={t("searchByNoteOrCategory")}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="h-8 text-sm flex-1 bg-surface"
                />
                <Button
                  variant="unstyled"
                  onClick={() => {
                    setSearchMode(false);
                    setSearchKeyword("");
                  }}
                  className="ml-2 text-secondary-text cursor-pointer p-1 shrink-0"
                >
                  <X size={20} />
                </Button>
              </div>
            )}

            {/* Child Content */}
            <main
              className={cn(
                "flex-1 w-full mx-auto",
                mainOverflowClassName,
                mainContentClassName,
              )}
            >
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
    </SidebarProvider>
  );
}
