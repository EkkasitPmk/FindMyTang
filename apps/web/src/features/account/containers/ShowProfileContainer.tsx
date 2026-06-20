"use client";
import { UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/shared/utils";

export default function ShowProfileContainer() {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "bg-surface fixed md:hidden top-0 z-40 w-full flex justify-between items-center px-4 py-2",
        pathname === "/account" || pathname === "/assets/new" ? "hidden" : "",
      )}
    >
      <div className="flex items-center gap-2">
        <Link
          href="/account"
          className="w-10 h-10 rounded-full flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-on-surface-variant">
            <UserRound />
          </span>
        </Link>
        <div className="flex flex-col">
          <h1 className="text-base font-medium leading-tight">
            Good Morning ☀️
          </h1>
          <p className="text-body-sm">
            13 June 2026
          </p>
        </div>
      </div>

      {/* ส่วนที่ห้ามเอาออกหรือทำอะไรก็ช่าง */}
      <div className="hidden">
        <button
          aria-label="Notifications"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors active:scale-95 duration-200"
        >
          <span className="material-symbols-outlined text-on-surface-variant">
            notifications
          </span>
        </button>
      </div>
      {/* ส่วนที่ห้ามเอาออกหรือทำอะไรก็ช่าง */}
    </header>
  );
}
