import { describe, it, expect } from "vitest";
import { TranslationKey } from "@/shared/lib/configs/translations.config";
import {
  isMainTabRoute,
  extractCategoryId,
  isSyntheticCategoryId,
  getSyntheticCategory,
  getMainContentClassNames,
  getMainLayoutRoute,
  shouldShowProfile,
  shouldLockContentScroll,
} from "./main-layout.helper";

describe("main-layout.helper", () => {
  it("maps supported paths to one route policy", () => {
    expect(getMainLayoutRoute("/dashboard")).toBe("dashboard");
    expect(getMainLayoutRoute("/assets/new")).toBe("assetsNew");
    expect(getMainLayoutRoute("/settings/account")).toBe("settingsAccount");
    expect(getMainLayoutRoute("/support/contact")).toBe("supportContact");
    expect(getMainLayoutRoute("/support/feedback")).toBe("supportFeedback");
    expect(getMainLayoutRoute("/analytics/category/cat-123")).toBe(
      "analyticsCategory",
    );
    expect(getMainLayoutRoute("/analytics/category/cat-123/extra")).toBe(
      "other",
    );
  });

  it("shows the profile only on the home route", () => {
    expect(shouldShowProfile("dashboard")).toBe(true);
    expect(shouldShowProfile("journal")).toBe(false);
    expect(shouldShowProfile("analytics")).toBe(false);
  });

  it("locks content scrolling only for full-height main tabs", () => {
    expect(shouldLockContentScroll("journal")).toBe(true);
    expect(shouldLockContentScroll("analytics")).toBe(true);
    expect(shouldLockContentScroll("transaction")).toBe(true);
    expect(shouldLockContentScroll("dashboard")).toBe(false);
  });

  it("correctly identifies main tab routes", () => {
    expect(isMainTabRoute("/dashboard")).toBe(true);
    expect(isMainTabRoute("/journal")).toBe(true);
    expect(isMainTabRoute("/analytics")).toBe(true);
    expect(isMainTabRoute("/transaction")).toBe(true);
    expect(isMainTabRoute("/categories")).toBe(false);
    expect(isMainTabRoute("/settings")).toBe(false);
  });

  it("extracts category ID from analytics category path", () => {
    expect(extractCategoryId("/analytics/category/cat-123")).toBe("cat-123");
    expect(extractCategoryId("/analytics")).toBeNull();
  });

  it("identifies synthetic category IDs", () => {
    expect(isSyntheticCategoryId("uncategorized_transfer")).toBe(true);
    expect(isSyntheticCategoryId("uncategorized_adjustment")).toBe(true);
    expect(isSyntheticCategoryId("uncategorized")).toBe(true);
    expect(isSyntheticCategoryId("real-cat-id")).toBe(false);
    expect(isSyntheticCategoryId(null)).toBe(false);
  });

  it("returns correct synthetic category object", () => {
    const mockT = (key: TranslationKey) => key.toUpperCase();
    const synth = getSyntheticCategory("uncategorized_transfer", mockT);
    expect(synth).toEqual({
      id: "uncategorized_transfer",
      name: "TRANSFER",
      color: "#3B82F6",
      type: "TRANSFER",
    });

    expect(getSyntheticCategory(null, mockT)).toBeNull();
  });

  it("calculates content class names based on route and header conditions", () => {
    const mainTabRes = getMainContentClassNames({
      isMainTab: true,
      shouldShowTopAppBar: false,
      isSearchMode: false,
      pathname: "/transaction",
    });
    expect(mainTabRes.mainContentClassName).toBe("pt-3");
    expect(mainTabRes.mainOverflowClassName).toBe("overflow-hidden");

    const assetSearchRes = getMainContentClassNames({
      isMainTab: false,
      shouldShowTopAppBar: true,
      isSearchMode: true,
      pathname: "/assets",
    });
    expect(assetSearchRes.mainContentClassName).toBe("");
  });
});
