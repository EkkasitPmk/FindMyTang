import Link from "next/link";
import { useRef } from "react";
import { navItems } from "../configs/navigation.config";
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
  const lastClickTimeRef = useRef<number>(0);

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
            <Button
              variant="unstyled"
              key={item.href}
              onClick={onMenuOpen}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-md text-[10px] font-semibold transition-colors duration-150 cursor-pointer outline-none ${
                isMoreActive
                  ? "text-primary"
                  : "text-secondary-text hover:text-primary-text"
              }`}
            >
              <div className="h-6 flex items-center justify-center">
                <MoreHorizontal
                  className={`w-5 h-5 transition-colors duration-150 ${
                    isMoreActive ? "text-primary" : "text-secondary-text"
                  }`}
                  strokeWidth={2}
                />
              </div>
              {t("navMore")}
            </Button>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={(e) => {
              if (item.href === "/transaction") {
                const now = Date.now();
                if (now - lastClickTimeRef.current < 300) {
                  e.preventDefault();
                  globalThis.location.href = item.href;
                }
                lastClickTimeRef.current = now;
              }
            }}
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
    </nav>
  );
}
