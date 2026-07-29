import { TransactionType } from "@/shared/lib/types/transaction.type";
import { TranslationKey } from "@/shared/lib/configs/translations.config";

export interface SyntheticCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
  type?: TransactionType;
}

export function isMainTabRoute(pathname: string): boolean {
  return ["/home", "/journal", "/analytics", "/transaction"].includes(pathname);
}

export function extractCategoryId(pathname: string): string | null {
  const match = new RegExp(/\/analytics\/category\/(.+)/).exec(pathname);
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
}: {
  isMainTab: boolean;
  shouldShowTopAppBar: boolean;
  isSearchMode: boolean;
  pathname: string;
}): { mainContentClassName: string; mainOverflowClassName: string } {
  let mainContentClassName = "px-0 py-3";
  let mainOverflowClassName = "overflow-y-auto max-h-screen";

  if (isMainTab) {
    if (
      pathname === "/transaction" ||
      pathname === "/journal" ||
      pathname === "/analytics"
    ) {
      mainContentClassName = "py-3";
      mainOverflowClassName = "overflow-hidden h-full";
    } else {
      mainContentClassName = "pt-15";
    }
  } else if (shouldShowTopAppBar) {
    if (pathname === "/assets" && isSearchMode) {
      mainContentClassName = "";
    } else {
      mainContentClassName = "pt-12";
    }
  }

  return { mainContentClassName, mainOverflowClassName };
}
