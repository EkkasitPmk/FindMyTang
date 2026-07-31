import { TranslationKey } from "@/shared/lib/configs/translations.config";
import {
  MainLayoutRoute,
  SyntheticCategory,
  MainContentClassNamesParams,
} from "../types/main-layout.type";

const MAIN_TAB_ROUTES = new Set<MainLayoutRoute>([
  "home",
  "journal",
  "analytics",
  "transaction",
]);
const ANALYTICS_CATEGORY_ROUTE = /^\/analytics\/category\/([^/]+)$/;

export function getMainLayoutRoute(pathname: string): MainLayoutRoute {
  if (pathname === "/home") return "home";
  if (pathname === "/journal") return "journal";
  if (pathname === "/analytics") return "analytics";
  if (pathname === "/transaction") return "transaction";
  if (pathname === "/categories") return "categories";
  if (pathname === "/assets") return "assets";
  if (pathname === "/assets/new") return "assetsNew";
  if (pathname === "/settings") return "settings";
  if (pathname === "/settings/account") return "settingsAccount";
  if (pathname === "/support/contact") return "supportContact";
  if (pathname === "/support/feedback") return "supportFeedback";
  if (ANALYTICS_CATEGORY_ROUTE.test(pathname)) return "analyticsCategory";
  return "other";
}

export function isMainTabRoute(pathname: string): boolean {
  return MAIN_TAB_ROUTES.has(getMainLayoutRoute(pathname));
}

export function shouldShowProfile(route: MainLayoutRoute): boolean {
  return route === "home";
}

export function shouldLockContentScroll(route: MainLayoutRoute): boolean {
  return ["transaction", "journal", "analytics"].includes(route);
}

export function extractCategoryId(pathname: string): string | null {
  const match = ANALYTICS_CATEGORY_ROUTE.exec(pathname);
  return match ? match[1] : null;
}

export function isSyntheticCategoryId(categoryId: string | null): boolean {
  if (!categoryId) return false;
  return [
    "uncategorized_transfer",
    "uncategorized_adjustment",
    "uncategorized",
  ].includes(categoryId);
}

export function getSyntheticCategory(
  id: string | null,
  t: (key: TranslationKey) => string,
): SyntheticCategory | null {
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
}

export function getMainContentClassNames({
  isMainTab,
  shouldShowTopAppBar,
  isSearchMode,
  pathname,
}: MainContentClassNamesParams): {
  mainContentClassName: string;
  mainOverflowClassName: string;
} {
  let mainContentClassName = "px-0 py-3";
  let mainOverflowClassName = "overflow-y-auto max-h-screen";

  const route = getMainLayoutRoute(pathname);

  if (isMainTab) {
    if (shouldLockContentScroll(route)) {
      mainContentClassName = "py-3";
      mainOverflowClassName = "overflow-hidden h-full";
    } else {
      mainContentClassName = "pt-15";
    }
  } else if (shouldShowTopAppBar) {
    if (route === "assets" && isSearchMode) {
      mainContentClassName = "";
    } else {
      mainContentClassName = "pt-12";
    }
  }

  return { mainContentClassName, mainOverflowClassName };
}
