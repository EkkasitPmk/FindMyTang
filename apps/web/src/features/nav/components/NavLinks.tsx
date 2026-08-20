import Link from "next/link";
import { navItems } from "../configs/navigation.config";
import { isNavItemActive } from "../helpers/navigation.helper";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { cn } from "@/shared/lib/utils/core.util";

interface NavLinksProps {
  pathname: string;
  onLinkClick?: (
    e?: React.MouseEvent<HTMLAnchorElement>,
    href?: string,
  ) => void;
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
        const isActive = isNavItemActive(pathname, item);
        const displayLabel = item.translationKey
          ? t(item.translationKey)
          : item.label;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={(e) => onLinkClick?.(e, item.href)}
            className={cn(
              "flex h-12 w-full items-center gap-3 overflow-hidden rounded-xl border border-transparent p-2 text-left text-sm font-medium outline-hidden ring-sidebar-ring transition-colors duration-200 focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground cursor-pointer",
              isActive
                ? "border-primary-light/80 bg-primary-light font-semibold text-primary shadow-xs"
                : "text-secondary-text hover:bg-sidebar-accent hover:text-primary-text",
              itemClassName,
            )}
          >
            <Icon
              className={cn(
                "size-5 shrink-0 transition-transform",
                isActive ? "scale-105 text-primary" : "text-secondary-text",
              )}
              strokeWidth={isActive ? 2.2 : 1.75}
            />
            <span className="truncate">{displayLabel}</span>
          </Link>
        );
      })}
    </nav>
  );
}
