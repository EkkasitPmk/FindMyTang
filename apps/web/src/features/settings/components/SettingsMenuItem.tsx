import Link from "next/link";
import type { MouseEventHandler } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

interface SettingsMenuItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  iconClassName: string;
  iconBackgroundClassName: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export default function SettingsMenuItem({
  href,
  label,
  icon: Icon,
  iconClassName,
  iconBackgroundClassName,
  onClick,
}: Readonly<SettingsMenuItemProps>) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="w-full flex justify-between items-center py-2 p-3.5 hover:bg-surface-secondary first:hover:rounded-tl-xl first:hover:rounded-tr-xl last:hover:rounded-bl-xl last:hover:rounded-br-xl transition-colors text-left outline-none cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${iconBackgroundClassName}`}>
          <Icon className={`w-4 h-4 ${iconClassName}`} strokeWidth={1.5} />
        </div>
        <span className="text-xs font-semibold text-primary-text">{label}</span>
      </div>
      <ChevronRight
        className="w-4 h-4 text-secondary-text/70"
        strokeWidth={1.5}
      />
    </Link>
  );
}
