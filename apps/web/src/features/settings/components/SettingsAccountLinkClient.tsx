"use client";
import Link from "next/link";
import { ChevronRight, User } from "lucide-react";
import { useIsGuest } from "@/shared/lib/storages/guest.storage";
import { useFeatureLockModal } from "@/shared/lib/hooks/useFeatureLockModal.hook";

export default function SettingsAccountLinkClient({
  label,
  lockMessage,
}: Readonly<{ label: string; lockMessage: string }>) {
  const isGuest = useIsGuest();
  const openLockModal = useFeatureLockModal((state) => state.openModal);

  return (
    <Link
      href="/settings/account"
      onClick={(event) => {
        if (isGuest) {
          event.preventDefault();
          openLockModal(lockMessage);
        }
      }}
      className="block bg-surface border border-border rounded-xl hover:bg-surface-secondary transition-colors cursor-pointer shadow-xs"
    >
      <div className="flex justify-between items-center py-2 p-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-info-light text-info">
            <User className="w-4 h-4" strokeWidth={1.5} />
          </div>
          <span className="text-xs font-semibold text-primary-text">
            {label}
          </span>
        </div>
        <ChevronRight
          className="w-4 h-4 text-secondary-text/70"
          strokeWidth={1.5}
        />
      </div>
    </Link>
  );
}
