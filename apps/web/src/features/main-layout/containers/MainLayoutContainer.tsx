"use client";
import ShowProfileContainer from "@/features/account/containers/ShowProfileContainer";
import NavContainer from "@/features/nav/containers/NavContainer";
import TopAppBarMobile from "@/shared/components/customs/TopAppBarMobile";
import CreateAssetsContainer from "@/features/assets/containers/CreateAssetsContainer";
import AssetsMenuContainer from "@/features/assets/containers/AssetsMenuContainer";
import { SidebarProvider } from "@/shared/components/animate-ui/components/radix/sidebar";
import { useMainLayout } from "../hooks/main-layout.hook";
import MainLayoutSearchBar from "../components/MainLayoutSearchBar";
import MainLayoutRightAction from "../components/MainLayoutRightAction";
import MainLayoutTitle from "../components/MainLayoutTitle";
import { shouldShowProfile } from "../helpers/main-layout.helper";

export default function MainLayoutContainer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const {
    route,
    translation: t,
    navigation,
    header,
    actions,
    search,
    dialog,
    content,
  } = useMainLayout();

  const assetMenu =
    route.name === "assets" && header.assetName !== undefined ? (
      <AssetsMenuContainer />
    ) : null;

  return (
    <SidebarProvider defaultOpen className="h-svh min-h-0 overflow-hidden">
      <div className="text-primary-text flex flex-col relative flex-1 min-w-0 min-h-0">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-primary-light/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] rounded-full bg-primary-light/20 blur-[120px] pointer-events-none" />

        <div className="flex flex-1 relative z-10 min-w-0 min-h-0">
          <NavContainer />

          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            {route.isMainTab && shouldShowProfile(route.name) && (
              <ShowProfileContainer />
            )}

            {route.shouldShowTopAppBar && !search.isSearchMode && (
              <div className="fixed w-full top-0 z-40 bg-background/80 backdrop-blur-md">
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

            {route.shouldShowTopAppBar && search.isSearchMode && (
              <MainLayoutSearchBar
                searchKeyword={search.searchKeyword}
                onSearchKeywordChange={search.setSearchKeyword}
                onCloseSearch={search.handleCloseSearch}
                placeholder={t("searchByNoteOrCategory")}
              />
            )}

            <main
              className={`flex-1 min-h-0 ${content.mainOverflowClassName} ${content.mainContentClassName}`}
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
