import Link from "next/link";
import { navItems } from "../configs/navigation.config";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { cn } from "@/shared/lib/utils/core.util";

interface NavLinksProps {
  pathname: string;
  onLinkClick?: () => void;
  className?: string;
  itemClassName?: string;
}

export default function NavLinks({
  pathname,
  onLinkClick,
  className,
  itemClassName,
}: Readonly<NavLinksProps>) {
  const { t } = useTranslation();

  return (
    <nav className={cn("space-y-1", className)}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);
        const displayLabel = item.translationKey
          ? t(item.translationKey)
          : item.label;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={cn(
              "flex items-center gap-3 px-4 rounded-md text-sm font-medium transition-all duration-200 active-press",
              isActive
                ? "bg-primary-light/50 text-primary border border-primary-light"
                : "text-secondary-text hover:text-primary-text hover:bg-surface-secondary border border-transparent",
              itemClassName,
            )}
          >
            <Icon
              className={cn(
                "w-4 h-4 transition-transform",
                isActive ? "text-primary" : "text-secondary-text",
              )}
              strokeWidth={isActive ? 2 : 1.5}
            />
            {displayLabel}
          </Link>
        );
      })}
    </nav>
  );
}
