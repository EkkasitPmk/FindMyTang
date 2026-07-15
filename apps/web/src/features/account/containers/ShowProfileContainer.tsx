"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/shared/lib/utils/core.util";
import Avatar from "@/shared/components/customs/Avatar";
import { useMeQuery } from "@/features/nav/hooks/auth.hook";

export default function ShowProfileContainer() {
  const pathname = usePathname();
  const { data: user } = useMeQuery();

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
          className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-surface-secondary border border-border"
        >
          <Avatar url={user?.avatarUrl} size={40} />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-base font-medium leading-tight">
            Good Morning ☀️
          </h1>
          <p className="text-body-sm">13 June 2026</p>
        </div>
      </div>

      {/* ส่วนที่ห้ามเอาออกหรือทำอะไรก็ช่าง */}
      {/* <div className="hidden">
        <Button variant="unstyled"
          aria-label="Notifications"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors active:scale-95 duration-200"
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
