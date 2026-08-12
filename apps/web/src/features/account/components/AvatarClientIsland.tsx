"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import AvatarSection from "./AvatarSection";
import LoadingModal from "@/shared/components/customs/LoadingModal";
import { updateProfileAction } from "../services/account.actions";
import { syncProfileCache } from "../helpers/profile-cache.helper";
import { useModalState } from "@/shared/lib/hooks/useModalState.hook";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import type { UserProfile } from "@/shared/lib/types/user.type";

export default function AvatarClientIsland({
  user,
}: Readonly<{ user: UserProfile | null }>) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [isSelectingAvatar, setIsSelectingAvatar] = useState(false);
  const { modalState, setModalState, resetModalState } = useModalState();

  const updateAvatar = (avatarUrl: string | null) => {
    startTransition(async () => {
      const result = await updateProfileAction({ avatarUrl });
      if (result.success) {
        await syncProfileCache(queryClient, result.data);
        router.refresh();
        return;
      }
      setModalState({ isOpen: true, status: "error", message: result.message });
    });
  };

  return (
    <>
      <AvatarSection
        user={user}
        isUpdating={isPending}
        isSelectingAvatar={isSelectingAvatar}
        onToggleSelectingAvatar={() => setIsSelectingAvatar(!isSelectingAvatar)}
        onCloseSelectingAvatar={() => setIsSelectingAvatar(false)}
        onSelectAvatar={(avatarUrl) => {
          updateAvatar(avatarUrl);
          setIsSelectingAvatar(false);
        }}
        onRemoveAvatar={(event) => {
          event.stopPropagation();
          updateAvatar(null);
        }}
      />
      <LoadingModal
        isOpen={modalState.isOpen || isPending}
        status={modalState.isOpen ? modalState.status : "loading"}
        message={
          modalState.isOpen
            ? modalState.message
            : t("updating") || "Updating..."
        }
        onClose={resetModalState}
      />
    </>
  );
}
