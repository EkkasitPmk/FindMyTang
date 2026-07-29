"use client";
import ShowProfileContainer from "@/features/account/containers/ShowProfileContainer";
import NavContainer from "@/features/nav/containers/NavContainer";
import TopAppBarMobile from "@/shared/components/customs/TopAppBarMobile";
import CreateAssetsContainer from "@/features/assets/containers/CreateAssetsContainer";
import { SidebarProvider } from "@/shared/components/animate-ui/components/radix/sidebar";
import { cn } from "@/shared/lib/utils/core.util";
import { useMainLayout } from "../hooks/main-layout.hook";
import MainLayoutSearchBar from "../components/MainLayoutSearchBar";
import MainLayoutRightAction from "../components/MainLayoutRightAction";
import MainLayoutTitle from "../components/MainLayoutTitle";

export default function MainLayoutContainer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const {
    pathname,
    router,
    t,
    isMainTab,
    shouldShowTopAppBar,
    currentCategory,
    assetName,
    isEditingList,
    toggleEditingList,
    isEditingAssets,
    toggleEditingAssets,
    hasAssets,
    isSearchMode,
    searchKeyword,
    setSearchKeyword,
    isCreateAssetModalOpen,
    setIsCreateAssetModalOpen,
    mainContentClassName,
    mainOverflowClassName,
    handleBack,
    handleCloseSearch,
  } = useMainLayout();

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
                  title={
                    <MainLayoutTitle
                      pathname={pathname}
                      assetName={assetName}
                      currentCategory={currentCategory}
                      t={t}
                    />
                  }
                  showBackButton={pathname !== "/settings"}
                  onBack={handleBack}
                  rightAction={
                    <MainLayoutRightAction
                      pathname={pathname}
                      isEditingList={isEditingList}
                      onToggleEditingList={toggleEditingList}
                      onBack={() => router.back()}
                      isAssetTitleMatch={
                        pathname === "/assets" && assetName !== undefined
                      }
                      hasAssets={hasAssets}
                      isEditingAssets={isEditingAssets}
                      onToggleEditingAssets={toggleEditingAssets}
                      onOpenCreateAssetModal={() =>
                        setIsCreateAssetModalOpen(true)
                      }
                      t={t}
                    />
                  }
                />
              </div>
            )}

            {shouldShowTopAppBar && isSearchMode && (
              <MainLayoutSearchBar
                searchKeyword={searchKeyword}
                onSearchKeywordChange={setSearchKeyword}
                onCloseSearch={handleCloseSearch}
                placeholder={t("searchByNoteOrCategory")}
              />
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
