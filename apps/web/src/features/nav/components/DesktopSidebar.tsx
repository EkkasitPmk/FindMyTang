import { Wallet } from "lucide-react";
import NavLinks from "./NavLinks";
import ThemeSwitcher from "@/shared/components/customs/ThemeSwitcher";
import SyncStatusButton from "@/shared/components/customs/SyncStatusButton";
import NavUserProfile from "./NavUserProfile";
import { UserProfile } from "@/shared/lib/types/user.type";

interface DesktopSidebarProps {
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

export default function DesktopSidebar({
  pathname,
  user,
  isLoading,
  onLogout,
  isGuest,
  isSyncing,
  syncStatus,
  onSyncClick,
  onNavigate,
}: Readonly<DesktopSidebarProps>) {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-surface sticky top-0 h-screen p-6 justify-between shrink-0">
      <div className="space-y-8">
        {/* Brand Title */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <Wallet className="w-4 h-4 text-white" strokeWidth={1.5} />
          </div>
          <span className="text-lg font-bold tracking-tight text-primary-text">
            PocketNote
          </span>
        </div>

        {/* Navigation links */}
        <NavLinks
          pathname={pathname}
          itemClassName="py-3"
          onLinkClick={onNavigate}
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <SyncStatusButton
            isGuest={isGuest}
            isSyncing={isSyncing}
            syncStatus={syncStatus}
            onSyncClick={onSyncClick}
          />
          <div className="px-4">
            <ThemeSwitcher />
          </div>
        </div>
        {/* User profile & Action */}
        <NavUserProfile
          user={user}
          isLoading={isLoading}
          onLogout={onLogout}
          className="pt-4 border-t border-border"
        />
      </div>
    </aside>
  );
}
