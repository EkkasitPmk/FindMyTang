import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import Avatar from "@/shared/components/customs/Avatar";
import { UserProfile } from "@/features/nav/types/auth.type";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { cn } from "@/shared/lib/utils/core.util";
import { Button } from "@/shared/components/customs/Button";

interface NavUserProfileProps {
  user?: UserProfile | null;
  isLoading: boolean;
  onLogout: () => void;
  onActionClick?: () => void;
  className?: string;
}

export default function NavUserProfile({
  user,
  isLoading,
  onLogout,
  onActionClick,
  className,
}: Readonly<NavUserProfileProps>) {
  const { t } = useTranslation();

  const userProfileContent = (() => {
    if (isLoading) {
      return (
        <div className="space-y-1.5 animate-pulse">
          <div className="h-3 w-20 bg-surface-secondary rounded" />
          <div className="h-2.5 w-28 bg-surface-secondary rounded" />
        </div>
      );
    }

    if (user) {
      return (
        <>
          <p className="text-xs font-semibold text-primary-text truncate leading-tight">
            {user.displayName}
          </p>
          <p className="text-[10px] text-secondary-text/80 truncate leading-tight">
            {user.email || "Guest"}
          </p>
        </>
      );
    }

    return (
      <p className="text-xs font-semibold leading-tight text-primary-text truncate">
        Guest User
      </p>
    );
  })();

  return (
    <div className={cn("space-y-2 pt-4 border-t border-border", className)}>
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-full bg-surface-secondary border border-border flex items-center justify-center overflow-hidden">
          <Avatar url={user?.avatarUrl} size={40} iconSize={20} />
        </div>
        <div className="overflow-hidden min-h-9 flex flex-col justify-center">
          {userProfileContent}
        </div>
      </div>
      {!isLoading &&
        (user ? (
          <Button
            variant="unstyled"
            onClick={() => {
              onLogout();
              onActionClick?.();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-secondary-text hover:text-expense hover:bg-expense-light/50 transition-all duration-200 border border-transparent active-press cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-expense" strokeWidth={1.5} />
            <span className="text-expense">Log Out</span>
          </Button>
        ) : (
          <Link
            href="/login"
            onClick={onActionClick}
            className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-secondary-text hover:text-primary hover:bg-primary-light/50 transition-all duration-200 border border-transparent active-press"
          >
            <LogIn className="w-4 h-4" strokeWidth={1.5} />
            {t("connectBtn")}
          </Link>
        ))}
    </div>
  );
}
