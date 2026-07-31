import { useState, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCategories } from "@/shared/lib/hooks/useCategories.hook";
import { useCategoryUIStore } from "@/features/category/hooks/category.hook";
import { Category } from "@/shared/lib/types/category.type";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { useAssetUIStore } from "@/features/assets/hooks/assets.hook";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import {
  isMainTabRoute,
  extractCategoryId,
  isSyntheticCategoryId,
  getSyntheticCategory,
  getMainContentClassNames,
  getMainLayoutRoute,
} from "../helpers/main-layout.helper";

export function useMainLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assetId = searchParams.get("id");
  const assetNameParam = searchParams.get("name");
  const { t } = useTranslation();
  const routeName = getMainLayoutRoute(pathname);

  // Asset Fetching & Resolution
  const shouldFetchAssets =
    routeName === "assets" && !assetNameParam && Boolean(assetId);
  const { data: assets } = useAssets({ enabled: shouldFetchAssets });
  const currentAsset = assets?.find((a) => a.id === assetId);
  const assetName = assetNameParam || currentAsset?.name;

  // Category Fetching & Synthetic Category Resolution
  const categoryId = useMemo(() => extractCategoryId(pathname), [pathname]);
  const isSynthetic = isSyntheticCategoryId(categoryId);
  const shouldFetchCategories = Boolean(categoryId && !isSynthetic);
  const { data: categories } = useCategories({
    enabled: shouldFetchCategories,
  });

  const currentCategory = useMemo(() => {
    if (!categoryId) return null;
    const found = categories?.find((c: Category) => c.id === categoryId);
    if (found) return found;
    return getSyntheticCategory(categoryId, t);
  }, [categories, categoryId, t]);

  // UI Stores
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

  // Tab & Header Conditions
  const isMainTab = isMainTabRoute(pathname);
  const shouldShowTopAppBar = !isMainTab;

  const { mainContentClassName, mainOverflowClassName } = useMemo(
    () =>
      getMainContentClassNames({
        isMainTab,
        shouldShowTopAppBar,
        isSearchMode,
        pathname,
      }),
    [isMainTab, shouldShowTopAppBar, isSearchMode, pathname],
  );

  const handleBack = () => {
    if (routeName === "supportFeedback" || routeName === "supportContact") {
      const event = new CustomEvent<{ handled: boolean }>(
        "support:before-back",
        { detail: { handled: false } },
      );
      window.dispatchEvent(event);
      if (event.detail.handled) return;
    }

    if (routeName === "assets" && assetName) {
      setSearchMode(false);
      setSearchKeyword("");
    }
    router.back();
  };

  const handleCloseSearch = () => {
    setSearchMode(false);
    setSearchKeyword("");
  };

  return {
    route: {
      pathname,
      name: routeName,
      isMainTab,
      shouldShowTopAppBar,
    },
    translation: t,
    navigation: {
      handleBack,
      handleClosePage: () => router.back(),
    },
    header: {
      currentCategory,
      assetName,
    },
    actions: {
      isEditingList,
      toggleEditingList,
      isEditingAssets,
      toggleEditingAssets,
      hasAssets,
    },
    search: {
      isSearchMode,
      searchKeyword,
      setSearchKeyword,
      handleCloseSearch,
    },
    dialog: {
      isCreateAssetModalOpen,
      openCreateAssetModal: () => setIsCreateAssetModalOpen(true),
      closeCreateAssetModal: () => setIsCreateAssetModalOpen(false),
    },
    content: {
      mainContentClassName,
      mainOverflowClassName,
    },
  };
}
