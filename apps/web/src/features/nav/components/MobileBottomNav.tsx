import Link from "next/link";
import {
  getMobileMoreNavItems,
  getMobilePrimaryNavItems,
  isNavItemActive,
} from "../helpers/navigation.helper";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import {
  Highlight,
  HighlightItem,
} from "@/shared/components/animate-ui/primitives/effects/highlight";
import { Slide } from "@/shared/components/animate-ui/primitives/effects/slide";

interface MobileBottomNavProps {
  pathname: string;
  mobileMenuOpen: boolean;
  isHidden: boolean;
  onMenuOpen: () => void;
  onNavigate: () => void;
}

export default function MobileBottomNav({
  pathname,
  mobileMenuOpen,
  isHidden,
  onMenuOpen,
  onNavigate,
}: Readonly<MobileBottomNavProps>) {
  const { t } = useTranslation();
  const isMoreActive =
    getMobileMoreNavItems().some((item) => isNavItemActive(pathname, item)) ||
    mobileMenuOpen;
  const activeValue = isMoreActive
    ? "more"
    : (getMobilePrimaryNavItems().find((item) =>
        isNavItemActive(pathname, item),
      )?.href ?? null);

  return (
    <Slide
      asChild
      direction="up"
      offset={96}
      animate={isHidden ? "hidden" : "visible"}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <nav
        aria-label="Primary navigation"
        aria-hidden={isHidden}
        className={`fixed bottom-4 left-3 right-3 z-40 rounded-[1.5rem] border border-border/70 bg-surface/95 px-1.5 py-1.5 backdrop-blur-xl md:hidden ${
          isHidden ? "pointer-events-none" : ""
        }`}
      >
        <Highlight
          mode="parent"
          value={activeValue}
          controlledItems
          className="pointer-events-none rounded-2xl bg-primary-light shadow-sm"
          containerClassName="grid grid-cols-5 items-center gap-0.5"
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
        >
          {getMobilePrimaryNavItems().map((item) => {
            const Icon = item.icon;
            const isActive = activeValue === item.href;
            const displayLabel = item.translationKey
              ? t(item.translationKey)
              : item.label;

            return (
              <HighlightItem key={item.href} value={item.href} asChild>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-label={displayLabel}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative z-10 flex min-h-10 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[0.5625rem] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                    isActive
                      ? "text-primary"
                      : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  <div className="flex h-5 items-center justify-center">
                    <Icon
                      className={`transition-colors duration-150 ${
                        item.href === "/transaction"
                          ? "h-5.5 w-5.5"
                          : "h-4.5 w-4.5"
                      }`}
                      strokeWidth={2}
                    />
                  </div>
                </Link>
              </HighlightItem>
            );
          })}
          <HighlightItem value="more" asChild>
            <Button
              variant="unstyled"
              onClick={onMenuOpen}
              aria-label={t("navMore")}
              className={`relative z-10 flex min-h-10 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[0.5625rem] font-semibold transition-colors duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                isMoreActive
                  ? "text-primary"
                  : "text-secondary-text hover:text-primary-text"
              }`}
            >
              <div className="flex h-5 items-center justify-center">
                <MoreHorizontal className="h-4.5 w-4.5" strokeWidth={2} />
              </div>
            </Button>
          </HighlightItem>
        </Highlight>
      </nav>
    </Slide>
  );
}
