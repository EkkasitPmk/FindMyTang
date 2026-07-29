import { describe, it, expect } from "vitest";
import {
  isMainTabRoute,
  extractCategoryId,
  isSyntheticCategoryId,
  getSyntheticCategory,
  getMainContentClassNames,
} from "./main-layout.helper";

describe("main-layout.helper", () => {
  it("correctly identifies main tab routes", () => {
    expect(isMainTabRoute("/home")).toBe(true);
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
    const mockT = (key: string) => key.toUpperCase();
    const synth = getSyntheticCategory("uncategorized_transfer", mockT as any);
    expect(synth).toEqual({
      id: "uncategorized_transfer",
      name: "TRANSFER",
      color: "#3B82F6",
      type: "TRANSFER",
    });

    expect(getSyntheticCategory(null, mockT as any)).toBeNull();
  });

  it("calculates content class names based on route and header conditions", () => {
    const mainTabRes = getMainContentClassNames({
      isMainTab: true,
      shouldShowTopAppBar: false,
      isSearchMode: false,
      pathname: "/transaction",
    });
    expect(mainTabRes.mainContentClassName).toBe("py-3");
    expect(mainTabRes.mainOverflowClassName).toBe("overflow-hidden h-full");

    const assetSearchRes = getMainContentClassNames({
      isMainTab: false,
      shouldShowTopAppBar: true,
      isSearchMode: true,
      pathname: "/assets",
    });
    expect(assetSearchRes.mainContentClassName).toBe("");
  });
});
