import Link from "next/link";
import { Wallet, X, User, LogIn, LogOut } from "lucide-react";
import { navItems } from "../configs/navigation.config";
import { UserProfile } from "@/features/nav/types/auth.type";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  user?: UserProfile | null;
  isLoading: boolean;
  onLogout: () => void;
}

export default function MobileDrawer({
  isOpen,
  onClose,
  pathname,
  user,
  isLoading,
  onLogout,
}: Readonly<MobileDrawerProps>) {
  if (!isOpen) return null;

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
          <p className="text-xs font-semibold text-on-surface">
            {user.displayName}
          </p>
          <p className="text-[10px] text-on-surface-variant/80">{user.email}</p>
        </>
      );
    }
    return (
      <>
        <p className="text-xs font-semibold text-on-surface">Guest</p>
        <p className="text-[10px] text-on-surface-variant/80">
          guest@pocketnote.me
        </p>
      </>
    );
  })();

  return (
    <div className="fixed inset-0 z-50 flex md:hidden bg-on-surface/10 backdrop-blur-xs transition-opacity duration-300">
      <div className="w-64 bg-surface-container-lowest border-r border-outline-variant/65 p-6 flex flex-col justify-between animate-in slide-in-from-left duration-200">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
                <Wallet className="w-4 h-4 text-on-primary" strokeWidth={1.5} />
              </div>
              <span className="text-md font-bold text-on-surface">
                PocketNote
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-surface-container-low text-on-surface-variant"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-all active-press ${
                    isActive
                      ? "bg-primary-container/8 text-primary border border-primary-container/10"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low border border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={isActive ? 2 : 1.5} />
                  {item.label === "More" ? "Settings" : item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2 pt-4 border-t border-outline-variant/65">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-md bg-surface-container-low flex items-center justify-center">
              <User
                className="w-5 h-5 text-on-surface-variant"
                strokeWidth={1.5}
              />
            </div>
            <div className="min-h-[36px] flex flex-col justify-center">
              {userProfileContent}
            </div>
          </div>
          {!isLoading &&
            (user ? (
              <button
                onClick={() => {
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-on-surface-variant hover:text-error hover:bg-error-container/10 transition-all active-press cursor-pointer border border-transparent"
              >
                <LogOut className="w-4 h-4 text-error" strokeWidth={1.5} />
                <span className="text-error">Log Out</span>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-on-surface-variant hover:text-primary hover:bg-primary-container/10 transition-all active-press border border-transparent"
              >
                <LogIn className="w-4 h-4" strokeWidth={1.5} />
                Sync & Backup
              </Link>
            ))}
        </div>
      </div>

      {/* Transparent dismiss area */}
      <button
        className="flex-1 cursor-default outline-hidden"
        onClick={onClose}
        aria-label="Close menu"
      />
    </div>
  );
}
