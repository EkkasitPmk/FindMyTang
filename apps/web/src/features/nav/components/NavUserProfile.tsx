import { useRouter } from "next/navigation";
import { LogIn, LogOut, MoreVertical, Settings, UserRound } from "lucide-react";
import Avatar from "@/shared/components/customs/Avatar";
import { UserProfile } from "@/shared/lib/types/user.type";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { cn } from "@/shared/lib/utils/core.util";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/animate-ui/components/radix/dropdown-menu";

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
  const router = useRouter();
  const mounted = useMounted();
  const { t } = useTranslation();

  const userProfileContent = (() => {
    if (!mounted || isLoading) {
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
      <p className="text-xs font-semibold text-primary-text truncate leading-tight">
        Guest User
      </p>
    );
  })();

  return (
    <div className={cn("w-full border-t border-border", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="unstyled"
            type="button"
            aria-label={t("account")}
            className="w-full flex items-center justify-between gap-2 px-2 py-2 rounded-lg hover:bg-surface-secondary transition-colors text-left cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 group-data-[collapsible=icon]:justify-center"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-10 h-10 rounded-full bg-surface-secondary border border-border flex items-center justify-center overflow-hidden shrink-0 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8">
                <Avatar url={user?.avatarUrl} size={40} iconSize={20} />
              </div>
              <div className="overflow-hidden min-h-9 flex flex-col justify-center group-data-[collapsible=icon]:hidden">
                {userProfileContent}
              </div>
            </div>
            <MoreVertical
              className="w-4 h-4 text-secondary-text shrink-0 group-data-[collapsible=icon]:hidden"
              strokeWidth={1.75}
            />
          </Button>
        </DropdownMenuTrigger>

        {mounted && !isLoading && (
          <DropdownMenuContent
            side="top"
            align="start"
            className="w-56 mb-1 group-data-[collapsible=icon]:ml-1"
          >
            <DropdownMenuItem
              onSelect={() => {
                onActionClick?.();
                router.push("/settings");
              }}
              className="py-2"
            >
              <Settings className="text-secondary-text" strokeWidth={1.75} />
              {t("navSettings")}
            </DropdownMenuItem>
            {user ? (
              <DropdownMenuItem
                onSelect={() => {
                  onActionClick?.();
                  router.push("/settings/account");
                }}
                className="py-2"
              >
                <UserRound className="text-secondary-text" strokeWidth={1.75} />
                {t("account")}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onSelect={() => {
                  onActionClick?.();
                  router.push("/login");
                }}
                className="py-2"
              >
                <LogIn className="text-primary" strokeWidth={1.75} />
                {t("connectAccountShort")}
              </DropdownMenuItem>
            )}
            {user && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => {
                    onActionClick?.();
                    onLogout();
                  }}
                  className="py-2"
                >
                  <LogOut strokeWidth={1.75} />
                  {t("signOut")}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
}
