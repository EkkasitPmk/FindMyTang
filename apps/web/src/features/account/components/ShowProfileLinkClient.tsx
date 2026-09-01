"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "@/shared/components/customs/Avatar";
import { useIsGuest } from "@/shared/lib/storages/guest.storage";
import { useFeatureLockModal } from "@/shared/lib/hooks/useFeatureLockModal.hook";
import type { UserProfile } from "@/shared/lib/types/user.type";

export default function ShowProfileLinkClient({
  user,
}: Readonly<{ user: UserProfile | null }>) {
  const isGuest = useIsGuest();
  const openLockModal = useFeatureLockModal((state) => state.openModal);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isGuest) {
      event.preventDefault();
      openLockModal("Account Settings & Cloud Backup");
      return;
    }
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches
    ) {
      event.preventDefault();
      router.push("/settings?tab=account");
    }
  };

  return (
    <Link
      href="/settings/account"
      onClick={handleClick}
      className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-surface-secondary border border-border shrink-0"
    >
      <Avatar url={user?.avatarUrl} size={40} />
    </Link>
  );
}
