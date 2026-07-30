import { navItems } from "../configs/navigation.config";
import { NavItem } from "../types/navigation.type";

export const isNavItemActive = (pathname: string, item: NavItem): boolean =>
  pathname === item.href || pathname.startsWith(`${item.href}/`);

export const getMobilePrimaryNavItems = (): NavItem[] =>
  navItems.filter((item) => item.mobilePlacement === "primary");

export const getMobileMoreNavItems = (): NavItem[] =>
  navItems.filter((item) => item.mobilePlacement === "more");

export const isGuestNavBlocked = (href: string, isGuest: boolean): boolean =>
  isGuest &&
  navItems.some((item) => item.guestLocked && isNavItemActive(href, item));

export const shouldShowMobileBottomNav = (pathname: string): boolean =>
  getMobilePrimaryNavItems().some((item) => isNavItemActive(pathname, item));
