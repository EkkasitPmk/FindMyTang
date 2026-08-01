import Link from "next/link";
import { Wallet } from "lucide-react";
import ThemeSwitcher from "@/shared/components/customs/ThemeSwitcher";
import SyncStatusButton from "@/shared/components/customs/SyncStatusButton";
import NavUserProfile from "./NavUserProfile";
import { UserProfile } from "@/shared/lib/types/user.type";
import { navItems } from "../configs/navigation.config";
import { isNavItemActive } from "../helpers/navigation.helper";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/shared/components/animate-ui/components/radix/sidebar";
import { cn } from "@/shared/lib/utils/core.util";

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
  const { t } = useTranslation();

  return (
    <Sidebar collapsible="icon" className="border-border bg-surface shadow-xs">
      <SidebarHeader className="border-b border-border/50 p-3 flex-row items-center justify-between group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2 transition-all duration-300">
        <div className="flex items-center gap-2.5 overflow-hidden transition-all duration-300 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:hidden">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-xs shrink-0">
            <Wallet className="w-4.5 h-4.5 text-white" strokeWidth={2} />
          </div>
          <span className="text-base font-bold tracking-tight text-primary-text truncate">
            FindMyTang
          </span>
        </div>
        <SidebarTrigger className="text-secondary-text hover:text-primary-text hover:bg-surface-secondary shrink-0" />
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 group-data-[collapsible=icon]:px-0 items-center justify-between">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isNavItemActive(pathname, item);
                const displayLabel = item.translationKey
                  ? t(item.translationKey)
                  : item.label;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={displayLabel}
                      size="lg"
                      asChild
                      className={cn(
                        "rounded-xl border border-transparent transition-colors duration-200 cursor-pointer font-medium text-sm",
                        isActive
                          ? "bg-primary-light text-primary font-semibold border-primary-light/80 shadow-xs"
                          : "text-secondary-text hover:text-primary-text",
                      )}
                    >
                      <Link
                        href={item.href}
                        onClick={(e) => onNavigate?.(e, item.href)}
                        className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
                      >
                        <Icon
                          className={cn(
                            "size-5 shrink-0 transition-transform",
                            isActive
                              ? "text-primary scale-105"
                              : "text-secondary-text",
                          )}
                          strokeWidth={isActive ? 2.2 : 1.75}
                        />
                        <span className="truncate group-data-[collapsible=icon]:hidden">
                          {displayLabel}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="space-y-2">
          <SyncStatusButton
            isGuest={isGuest}
            isSyncing={isSyncing}
            syncStatus={syncStatus}
            onSyncClick={onSyncClick}
          />
          <ThemeSwitcher />
        </div>
      </SidebarContent>

      <SidebarFooter className="px-2 p-3 gap-3 border-t border-border/50 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:gap-2">
        <NavUserProfile
          user={user}
          isLoading={isLoading}
          onLogout={onLogout}
          className="border-t-0"
        />
      </SidebarFooter>
    </Sidebar>
  );
}
