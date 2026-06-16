import Link from "next/link";
import { Wallet, User, LogIn, LogOut } from "lucide-react";
import { navItems } from "../configs/navigation.config";
import { UserProfile } from "@/features/nav/types/auth.type";

interface DesktopSidebarProps {
  pathname: string;
  user?: UserProfile | null;
  isLoading: boolean;
  onLogout: () => void;
}

export default function DesktopSidebar({
  pathname,
  user,
  isLoading,
  onLogout,
}: Readonly<DesktopSidebarProps>) {
  const userProfileContent = (() => {
    if (isLoading) {
      return (
        <div className="space-y-1.5 animate-pulse">
          <div className="h-3 w-20 bg-surface-container-high rounded" />
          <div className="h-2.5 w-28 bg-surface-container-high rounded" />
        </div>
      );
    }
    if (user) {
      return (
        <>
          <p className="text-xs font-semibold text-on-surface truncate">
            {user.displayName}
          </p>
          <p className="text-[10px] text-on-surface-variant/80 truncate">
            {user.email}
          </p>
        </>
      );
    }
    return (
      <>
        <p className="text-xs font-semibold text-on-surface truncate">Guest</p>
        <p className="text-[10px] text-on-surface-variant/80 truncate">
          guest@pocketnote.me
        </p>
      </>
    );
  })();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-outline-variant/65 bg-surface-container-lowest sticky top-0 h-screen p-6 justify-between shrink-0">
      <div className="space-y-8">
        {/* Brand Title */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shadow-sm">
            <Wallet className="w-4 h-4 text-on-primary" strokeWidth={1.5} />
          </div>
          <span className="text-lg font-bold tracking-tight text-on-surface">
            PocketNote
          </span>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 active-press ${
                  isActive
                    ? "bg-primary-container/8 text-primary border border-primary-container/10"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low border border-transparent"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform ${isActive ? "text-primary" : "text-on-surface-variant"}`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile & Action */}
      <div className="space-y-4 pt-6 border-t border-outline-variant/65">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-md bg-surface-container-low border border-outline-variant/50 flex items-center justify-center overflow-hidden">
            <User
              className="w-5 h-5 text-on-surface-variant"
              strokeWidth={1.5}
            />
          </div>
          <div className="overflow-hidden min-h-[36px] flex flex-col justify-center">
            {userProfileContent}
          </div>
        </div>
        {!isLoading &&
          (user ? (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-on-surface-variant hover:text-error hover:bg-error-container/10 transition-all duration-200 border border-transparent active-press cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-error" strokeWidth={1.5} />
              <span className="text-error">Log Out</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-on-surface-variant hover:text-primary hover:bg-primary-container/10 transition-all duration-200 border border-transparent active-press"
            >
              <LogIn className="w-4 h-4" strokeWidth={1.5} />
              Sync & Backup
            </Link>
          ))}
      </div>
    </aside>
  );
}
