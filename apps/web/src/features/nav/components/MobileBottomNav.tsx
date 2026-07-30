import Link from "next/link";
import {
  getMobileMoreNavItems,
  getMobilePrimaryNavItems,
  isNavItemActive,
} from "../helpers/navigation.helper";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";

interface MobileBottomNavProps {
  pathname: string;
  mobileMenuOpen: boolean;
  onMenuOpen: () => void;
}

export default function MobileBottomNav({
  pathname,
  mobileMenuOpen,
  onMenuOpen,
}: Readonly<MobileBottomNavProps>) {
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface/90 backdrop-blur-md border-t border-border grid grid-cols-5 items-center py-2 px-4 shadow-sm">
      {getMobilePrimaryNavItems().map((item) => {
        const Icon = item.icon;
        const isActive = isNavItemActive(pathname, item);
        const displayLabel = item.translationKey
          ? t(item.translationKey)
          : item.label;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-md text-[10px] font-semibold transition-colors duration-150 ${
              isActive
                ? "text-primary"
                : "text-secondary-text hover:text-primary-text"
            }`}
          >
            <div className="h-6 flex items-center justify-center">
              <Icon
                className={`transition-colors duration-150 ${
                  item.href === "/transaction" ? "w-6 h-6" : "w-5 h-5"
                } ${isActive ? "text-primary" : "text-secondary-text"}`}
                strokeWidth={2}
              />
            </div>
            {displayLabel}
          </Link>
        );
      })}
      <Button
        variant="unstyled"
        onClick={onMenuOpen}
        className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-md text-[10px] font-semibold transition-colors duration-150 cursor-pointer outline-none ${
          getMobileMoreNavItems().some((item) =>
            isNavItemActive(pathname, item),
          ) || mobileMenuOpen
            ? "text-primary"
            : "text-secondary-text hover:text-primary-text"
        }`}
      >
        <div className="h-6 flex items-center justify-center">
          <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
        </div>
        {t("navMore")}
      </Button>
    </nav>
  );
}
