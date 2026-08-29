"use client";
import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAssetUIStore } from "@/features/assets/hooks/assets.hook";
import { cn } from "@/shared/lib/utils/core.util";
import {
  getMainContentClassNames,
  getDesktopSettingsRedirectHref,
  isMainTabRoute,
} from "../helpers/main-layout.helper";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import MainLayoutSearchBar from "./MainLayoutSearchBar";

export default function MainLayoutContentClient({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const isSearchMode = useAssetUIStore((state) => state.isSearchMode);
  const searchKeyword = useAssetUIStore((state) => state.searchKeyword);
  const setSearchKeyword = useAssetUIStore((state) => state.setSearchKeyword);
  const setSearchMode = useAssetUIStore((state) => state.setSearchMode);
  const isMainTab = isMainTabRoute(pathname);
  const shouldShowTopAppBar = !isMainTab;
  const desktopRedirectHref = getDesktopSettingsRedirectHref(
    pathname,
    searchParams.get("id"),
  );
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

  useEffect(() => {
    if (!desktopRedirectHref) return;

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const redirectOnDesktop = () => {
      if (mediaQuery.matches) router.replace(desktopRedirectHref);
    };

    redirectOnDesktop();
    mediaQuery.addEventListener("change", redirectOnDesktop);
    return () => mediaQuery.removeEventListener("change", redirectOnDesktop);
  }, [desktopRedirectHref, router]);

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
          "flex-1 min-h-0",
          mainOverflowClassName,
          mainContentClassName,
        )}
      >
        {children}
      </main>
    </>
  );
}
