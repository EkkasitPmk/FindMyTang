import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCategories } from "@/shared/lib/hooks/useCategories.hook";
import { useCategoryUIStore } from "@/features/category/hooks/category.hook";
import { Category } from "@/shared/lib/types/category.type";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { useAssetUIStore } from "@/features/assets/hooks/assets.hook";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import {
  isMainTabRoute,
  extractCategoryId,
  isSyntheticCategoryId,
  getSyntheticCategory,
  getMainContentClassNames,
} from "../helpers/main-layout.helper";

export function useMainLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assetId = searchParams.get("id");
  const assetNameParam = searchParams.get("name");
  const { t } = useTranslation();

  // Guest Store Initializer Side-Effect
  useEffect(() => {
    if (!localStorage.getItem("findmytang-guest-storage")) {
      useGuestStore.setState({ isGuest: true });
    }

    const runDexieTasks = () => {
      useGuestStore.getState().seedDefaultGuestData().catch(console.error);
      useGuestStore.getState().runAutoDeleteTasks().catch(console.error);
    };

    const timer = setTimeout(runDexieTasks, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Asset Fetching & Resolution
  const shouldFetchAssets =
    pathname === "/assets" && !assetNameParam && Boolean(assetId);
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
    if (pathname === "/assets" && assetName) {
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
  };
}
