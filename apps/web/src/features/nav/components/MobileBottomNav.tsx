import Link from "next/link";
import { navItems } from "../configs/navigation.config";
import { useTranslation } from "@/shared/lib/i18n/useTranslation";
import { MoreHorizontal } from "lucide-react";

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
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);
        const displayLabel = item.translationKey
          ? t(item.translationKey)
          : item.label;

        if (item.href === "/settings") {
          const isMoreActive =
            pathname.startsWith("/settings") || mobileMenuOpen;
          return (
            <button
              key={item.href}
              onClick={onMenuOpen}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-md text-[10px] font-semibold transition-all active-press cursor-pointer outline-none ${
                isMoreActive
                  ? "text-primary"
                  : "text-secondary-text hover:text-primary-text"
              }`}
            >
              <div className="h-6 flex items-center justify-center">
                <MoreHorizontal
                  className="w-5 h-5"
                  strokeWidth={isMoreActive ? 2 : 1.5}
                />
              </div>
              {t("navMore")}
            </button>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-md text-[10px] font-semibold transition-all active-press ${
              isActive
                ? "text-primary"
                : "text-secondary-text hover:text-primary-text"
            }`}
          >
            <div className="h-6 flex items-center justify-center">
              <Icon
                className={item.href === "/transaction" ? "w-6 h-6" : "w-5 h-5"}
                strokeWidth={isActive ? 2 : 1.5}
              />
            </div>
            {displayLabel}
          </Link>
        );
      })}
    </nav>
  );
}
