import { describe, expect, it } from "vitest";
import { navItems } from "../configs/navigation.config";
import {
  getMobileMoreNavItems,
  getMobilePrimaryNavItems,
  isGuestNavBlocked,
  isNavItemActive,
  shouldShowMobileBottomNav,
} from "./navigation.helper";

describe("navigation helper", () => {
  it("matches a route and its nested routes without prefix collisions", () => {
    const analytics = navItems.find((item) => item.href === "/analytics");

    expect(analytics).toBeDefined();
    expect(isNavItemActive("/analytics", analytics!)).toBe(true);
    expect(isNavItemActive("/analytics/category/foo", analytics!)).toBe(true);
    expect(isNavItemActive("/analytics-archive", analytics!)).toBe(false);
  });

  it("keeps mobile primary and More items configuration-driven", () => {
    expect(getMobilePrimaryNavItems().map((item) => item.href)).toEqual([
      "/dashboard",
      "/journal",
      "/transaction",
      "/analytics",
    ]);
    expect(getMobileMoreNavItems().map((item) => item.href)).toEqual([]);
  });

  it("blocks only guest-locked routes", () => {
    expect(isGuestNavBlocked("/settings", true)).toBe(false);
    expect(isGuestNavBlocked("/settings/account", true)).toBe(true);
    expect(isGuestNavBlocked("/dashboard", true)).toBe(false);
    expect(isGuestNavBlocked("/settings/account", false)).toBe(false);
  });

  it("shows bottom navigation for primary routes and nested routes", () => {
    expect(shouldShowMobileBottomNav("/dashboard")).toBe(true);
    expect(shouldShowMobileBottomNav("/analytics/category/foo")).toBe(true);
    expect(shouldShowMobileBottomNav("/settings")).toBe(false);
  });
});
