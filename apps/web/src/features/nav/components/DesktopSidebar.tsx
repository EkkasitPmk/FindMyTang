import { Wallet } from "lucide-react";
import NavLinks from "./NavLinks";
import NavUserProfile from "./NavUserProfile";
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
        <NavLinks pathname={pathname} itemClassName="py-3" />
      </div>

      {/* User profile & Action */}
      <NavUserProfile
        user={user}
        isLoading={isLoading}
        onLogout={onLogout}
        className="pt-6 border-t border-border"
      />
    </aside>
  );
}
