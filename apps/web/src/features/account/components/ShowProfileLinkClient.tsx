"use client";
import Link from "next/link";
import Avatar from "@/shared/components/customs/Avatar";
import { useIsGuest } from "@/shared/lib/storages/guest.storage";
import { useFeatureLockModal } from "@/shared/lib/hooks/useFeatureLockModal.hook";
import type { UserProfile } from "@/shared/lib/types/user.type";

export default function ShowProfileLinkClient({
  user,
}: Readonly<{ user: UserProfile | null }>) {
  const isGuest = useIsGuest();
  const openLockModal = useFeatureLockModal((state) => state.openModal);

  return (
    <Link
      href="/settings/account"
      onClick={(event) => {
        if (isGuest) {
          event.preventDefault();
          openLockModal("Account Settings & Cloud Backup");
        }
      }}
      className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-surface-secondary border border-border shrink-0"
    >
      <Avatar url={user?.avatarUrl} size={40} />
    </Link>
  );
}
