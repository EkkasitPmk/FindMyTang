"use client";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useAssetUIStore } from "@/features/assets/hooks/assets.hook";
import { cn } from "@/shared/lib/utils/core.util";
import {
  getMainContentClassNames,
  isMainTabRoute,
} from "../helpers/main-layout.helper";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import MainLayoutSearchBar from "./MainLayoutSearchBar";

export default function MainLayoutContentClient({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const isSearchMode = useAssetUIStore((state) => state.isSearchMode);
  const searchKeyword = useAssetUIStore((state) => state.searchKeyword);
  const setSearchKeyword = useAssetUIStore((state) => state.setSearchKeyword);
  const setSearchMode = useAssetUIStore((state) => state.setSearchMode);
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
    [isMainTab, isSearchMode, pathname, shouldShowTopAppBar],
  );

  return (
    <>
      {shouldShowTopAppBar && isSearchMode && (
        <MainLayoutSearchBar
          searchKeyword={searchKeyword}
          onSearchKeywordChange={setSearchKeyword}
          onCloseSearch={() => {
            setSearchMode(false);
            setSearchKeyword("");
          }}
          placeholder={t("searchByNoteOrCategory")}
        />
      )}
      <main
        className={cn(
          "flex-1 min-h-0 sm:px-6",
          mainOverflowClassName,
          mainContentClassName,
        )}
      >
        {children}
      </main>
    </>
  );
}
