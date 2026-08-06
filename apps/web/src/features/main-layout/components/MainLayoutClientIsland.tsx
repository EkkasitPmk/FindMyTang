"use client";
import TopAppBarMobile from "@/shared/components/customs/TopAppBarMobile";
import CreateAssetsContainer from "@/features/assets/containers/CreateAssetsContainer";
import AssetsMenuContainer from "@/features/assets/containers/AssetsMenuContainer";
import { SidebarProvider } from "@/shared/components/animate-ui/components/radix/sidebar";
import { useMainLayout } from "../hooks/main-layout.hook";
import MainLayoutSearchBar from "./MainLayoutSearchBar";
import MainLayoutRightAction from "./MainLayoutRightAction";
import MainLayoutTitle from "./MainLayoutTitle";
import { getMainLayoutDescription } from "../helpers/main-layout.helper";
import { cn } from "@/shared/lib/utils/core.util";
import TransactionSheet from "@/features/transactions/components/TransactionSheet";
import type { Asset } from "@/shared/lib/types/asset.type";
import type { Category } from "@/shared/lib/types/category.type";

export default function MainLayoutClientIsland({
  children,
  initialAssets,
  initialCategories,
  nav,
}: Readonly<{
  children: React.ReactNode;
  initialAssets?: Asset[];
  initialCategories?: Category[];
  nav: React.ReactNode;
}>) {
  const {
    route,
    translation: t,
    navigation,
    header,
    actions,
    search,
    dialog,
    content,
  } = useMainLayout({ initialAssets, initialCategories });

  const assetMenu =
    route.name === "assets" && header.assetName !== undefined ? (
      <AssetsMenuContainer />
    ) : null;

  return (
    <SidebarProvider defaultOpen className="h-svh min-h-0 overflow-hidden">
      <div className="text-primary-text flex flex-col relative flex-1 min-w-0 min-h-0">
        <div className="flex flex-1 relative z-10 min-w-0 min-h-0">
          {nav}
          <TransactionSheet />

          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            {route.shouldShowTopAppBar && !search.isSearchMode && (
              <div className="fixed md:hidden w-full top-0 z-40 bg-background/80 backdrop-blur-md">
                <TopAppBarMobile
                  title={
                    <MainLayoutTitle
                      route={route.name}
                      assetName={header.assetName}
                      currentCategory={header.currentCategory}
                      t={t}
                    />
                  }
                  showBackButton={route.name !== "settings"}
                  onBack={navigation.handleBack}
                  rightAction={
                    <MainLayoutRightAction
                      route={route.name}
                      isEditingList={actions.isEditingList}
                      onToggleEditingList={actions.toggleEditingList}
                      onBack={navigation.handleClosePage}
                      hasAssets={actions.hasAssets}
                      isEditingAssets={actions.isEditingAssets}
                      onToggleEditingAssets={actions.toggleEditingAssets}
                      onOpenCreateAssetModal={dialog.openCreateAssetModal}
                      assetMenu={assetMenu}
                      t={t}
                    />
                  }
                />
              </div>
            )}

            <div
              className={cn(
                "hidden md:block bg-surface sm:px-6 py-4",
                "border-b border-border",
              )}
            >
              <MainLayoutTitle
                route={route.name}
                assetName={header.assetName}
                currentCategory={header.currentCategory}
                t={t}
              />
              <p className="text-sm text-muted-foreground">
                {getMainLayoutDescription(route.name, t)}
              </p>
            </div>

            {route.shouldShowTopAppBar && search.isSearchMode && (
              <MainLayoutSearchBar
                searchKeyword={search.searchKeyword}
                onSearchKeywordChange={search.setSearchKeyword}
                onCloseSearch={search.handleCloseSearch}
                placeholder={t("searchByNoteOrCategory")}
              />
            )}

            <main
              className={cn(
                "flex-1 min-h-0 sm:px-6",
                content.mainOverflowClassName,
                content.mainContentClassName,
              )}
            >
              {children}

              {dialog.isCreateAssetModalOpen && (
                <CreateAssetsContainer onClose={dialog.closeCreateAssetModal} />
              )}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
