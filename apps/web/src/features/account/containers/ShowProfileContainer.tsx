"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/shared/lib/utils/core.util";
import Avatar from "@/shared/components/customs/Avatar";
import { useMeQuery } from "@/shared/lib/hooks/useMeQuery.hook";
import { useIsGuest } from "@/shared/lib/storages/guest.storage";
import { format } from "date-fns";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useFeatureLockModal } from "@/shared/lib/hooks/useFeatureLockModal.hook";

export default function ShowProfileContainer() {
  const pathname = usePathname();
  const { data: user, isLoading, isError } = useMeQuery();
  const isGuest = useIsGuest();
  const openLockModal = useFeatureLockModal((state) => state.openModal);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) return { text: "Good Afternoon", icon: "⛅️" };
    if (hour >= 17) return { text: "Good Evening", icon: "🌙" };
    return { text: "Good Morning", icon: "☀️" };
  };

  const displayName = isGuest ? "Guest" : user?.displayName || "User";
  const currentDate = format(new Date(), "EEEE, d MMMM");
  const greeting = getGreeting();

  return (
    <header
      className={cn(
        "bg-background fixed md:hidden top-0 z-40 w-full flex justify-between items-center px-4 py-2",
        pathname === "/settings/account" || pathname === "/assets/new"
          ? "hidden"
          : "",
      )}
    >
      <div className="flex items-center gap-2">
        <Link
          href="/settings/account"
          onClick={(e) => {
            if (isGuest) {
              e.preventDefault();
              openLockModal("Account Settings & Cloud Backup");
            }
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-surface-secondary border border-border shrink-0"
        >
          <Avatar url={user?.avatarUrl} size={40} />
        </Link>
        <div className="flex flex-col">
          {!isGuest && (isLoading || isError) ? (
            <Skeleton className="h-5 w-32 mb-1" />
          ) : (
            <h1 className="text-base font-medium leading-tight line-clamp-1">
              {greeting.text}, {displayName} {greeting.icon}
            </h1>
          )}

          {!isGuest && (isLoading || isError) ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <p className="text-sm text-secondary-text">{currentDate}</p>
          )}
        </div>
      </div>

      {/* ส่วนที่ห้ามเอาออกหรือทำอะไรก็ช่าง */}
      {/* <div className="hidden">
        <Button variant="unstyled"
          aria-label="Notifications"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-secondary-text">
            notifications
          </span>
        </Button>
      </div> */}
      {/* ส่วนที่ห้ามเอาออกหรือทำอะไรก็ช่าง */}
    </header>
  );
}
