import { Wallet, X } from "lucide-react";
import NavLinks from "./NavLinks";
import SyncStatusButton from "@/shared/components/customs/SyncStatusButton";
import NavUserProfile from "./NavUserProfile";
import { UserProfile } from "@/shared/lib/types/user.type";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { cn } from "@/shared/lib/utils/core.util";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  user?: UserProfile | null;
  isLoading: boolean;
  onLogout: () => void;
  isGuest: boolean;
  isSyncing: boolean;
  syncStatus: "synced" | "syncing" | "offline";
  onSyncClick?: () => void;
  onNavigate?: (e?: React.MouseEvent<HTMLAnchorElement>, href?: string) => void;
}

export default function MobileDrawer({
  isOpen,
  onClose,
  pathname,
  user,
  isLoading,
  onLogout,
  isGuest,
  isSyncing,
  syncStatus,
  onSyncClick,
  onNavigate,
}: Readonly<MobileDrawerProps>) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 md:hidden overflow-hidden transition-all duration-200",
        isOpen
          ? "visible pointer-events-auto"
          : "invisible pointer-events-none",
      )}
    >
      {/* Backdrop */}
      <Button
        variant="unstyled"
        hoverScale={1}
        tapScale={1}
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-primary-text/30 border-none p-0 outline-none transition-opacity duration-200 ease-out",
          isOpen ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-[min(85vw,320px)] bg-surface border-r border-border p-4 flex flex-col justify-between transition-transform duration-200 ease-out shadow-xl transform-gpu will-change-transform",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 w-8 h-8 rounded-md flex items-center justify-center">
                <Wallet className="w-4 h-4 text-primary" />
              </div>
              <span className="text-base font-bold tracking-tight text-primary-text">
                FindMyTang
              </span>
            </div>
            <Button
              variant="unstyled"
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-surface-secondary text-secondary-text transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </Button>
          </div>

          {/* Navigation list */}
          <NavLinks
            pathname={pathname}
            onLinkClick={(e, href) => {
              onNavigate?.(e, href);
              onClose();
            }}
            itemClassName="py-2"
          />
        </div>

        <div className="space-y-1">
          <SyncStatusButton
            isGuest={isGuest}
            isSyncing={isSyncing}
            syncStatus={syncStatus}
            onSyncClick={onSyncClick}
          />
          {/* User profile & Action */}
          <NavUserProfile
            user={user}
            isLoading={isLoading}
            onLogout={onLogout}
            onActionClick={onClose}
            flatMenu
            className="pt-2"
          />
        </div>
      </div>
    </div>
  );
}
