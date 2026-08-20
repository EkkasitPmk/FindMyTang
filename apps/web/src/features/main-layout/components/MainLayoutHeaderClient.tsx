"use client";
import { useState } from "react";
import TopAppBarMobile from "@/shared/components/customs/TopAppBarMobile";
import CreateAssetsContainer from "@/features/assets/containers/CreateAssetsContainer";
import AssetsMenuContainer from "@/features/assets/containers/AssetsMenuContainer";
import { useAssetUIStore } from "@/features/assets/hooks/assets.hook";
import { cn } from "@/shared/lib/utils/core.util";
import type { Asset } from "@/shared/lib/types/asset.type";
import type { Category } from "@/shared/lib/types/category.type";
import { getMainLayoutDescription } from "../helpers/main-layout.helper";
import { useMainLayout } from "../hooks/main-layout.hook";
import MainLayoutRightAction from "./MainLayoutRightAction";
import MainLayoutTitle from "./MainLayoutTitle";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { ChevronLeft } from "lucide-react";

export default function MainLayoutHeaderClient({
  initialAssets,
  initialCategories,
}: Readonly<{
  initialAssets?: Asset[];
  initialCategories?: Category[];
}>) {
  const [isCreateAssetModalOpen, setIsCreateAssetModalOpen] = useState(false);
  const {
    route,
    translation: t,
    navigation,
    header,
    actions,
  } = useMainLayout({
    initialAssets,
    initialCategories,
  });
  const isSearchMode = useAssetUIStore((state) => state.isSearchMode);
  const assetMenu =
    route.name === "assets" && header.assetName !== undefined ? (
      <AssetsMenuContainer />
    ) : null;

  return (
    <>
      {route.shouldShowTopAppBar && !isSearchMode && (
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
                onOpenCreateAssetModal={() => setIsCreateAssetModalOpen(true)}
                assetMenu={assetMenu}
                t={t}
              />
            }
          />
        </div>
      )}

      <div
        className={cn(
          "hidden md:flex items-center justify-between bg-surface sm:px-6 py-4",
          "border-b border-border",
          route.shouldShowTopAppBar && route.name !== "settings" && "sm:pl-2",
        )}
      >
        <div className="flex items-center gap-2">
          {route.shouldShowTopAppBar && route.name !== "settings" && (
            <Button
              variant="unstyled"
              type="button"
              onClick={navigation.handleBack}
              className="p-1 cursor-pointer lg:hidden"
            >
              <ChevronLeft size={24} />
            </Button>
          )}
          <div>
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
        </div>
        <div className="lg:hidden">
          <MainLayoutRightAction
            route={route.name}
            isEditingList={actions.isEditingList}
            onToggleEditingList={actions.toggleEditingList}
            onBack={navigation.handleClosePage}
            hasAssets={actions.hasAssets}
            isEditingAssets={actions.isEditingAssets}
            onToggleEditingAssets={actions.toggleEditingAssets}
            onOpenCreateAssetModal={() => setIsCreateAssetModalOpen(true)}
            assetMenu={assetMenu}
            t={t}
          />
        </div>
      </div>

      {isCreateAssetModalOpen && (
        <CreateAssetsContainer
          onClose={() => setIsCreateAssetModalOpen(false)}
        />
      )}
    </>
  );
}
