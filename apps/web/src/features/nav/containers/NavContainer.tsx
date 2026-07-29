"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { LogOut } from "lucide-react";
import { useLogoutMutation, useSyncUserMutation } from "../hooks/auth.hook";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import DesktopSidebar from "../components/DesktopSidebar";
import MobileDrawer from "../components/MobileDrawer";
import MobileBottomNav from "../components/MobileBottomNav";
import ConfirmModal from "@/shared/components/customs/ConfirmModal";
import LoadingModal from "@/shared/components/customs/LoadingModal";
import { useConfirmModal } from "@/shared/lib/hooks/useConfirmModal.hook";
import { useFeatureLockModal } from "@/shared/lib/hooks/useFeatureLockModal.hook";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { useMeQuery } from "@/shared/lib/hooks/useMeQuery.hook";
import { useModalState } from "@/shared/lib/hooks/useModalState.hook";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";

export default function NavContainer() {
  const pathname = usePathname();
  const isClientMounted = useMounted();

  const { data: user, isLoading } = useMeQuery();
  const queryClient = useQueryClient();
  const { isGuest, setGuestMode, clearGuestData } = useGuestStore();
  const openLockModal = useFeatureLockModal((state) => state.openModal);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<
    "synced" | "syncing" | "offline"
  >("synced");
  const [isLoggingOutLocal, setIsLoggingOutLocal] = useState(false);
  const { modalState, setModalState, resetModalState } = useModalState();

  const { t } = useTranslation();

  const {
    isOpen: logoutConfirmOpen,
    open: openLogoutConfirm,
    close: closeLogoutConfirm,
  } = useConfirmModal();

  const { mutateAsync: logoutUserAsync, isPending: isLogoutPending } =
    useLogoutMutation({
      onSuccess: () => {
        window.location.href = "/home";
      },
      onError: () => {
        setIsLoggingOutLocal(false);
      },
    });

  const syncUserMutation = useSyncUserMutation();

  const handleSyncClick = () => {
    if (isGuest) {
      openLockModal(t("cloudSyncBackup"));
      return;
    }

    setIsSyncing(true);
    setSyncStatus("syncing");
    setModalState({
      isOpen: true,
      status: "loading",
      message: t("syncing"),
    });

    syncUserMutation.mutate(undefined, {
      onSuccess: () => {
        void queryClient
          .refetchQueries()
          .then(() => {
            setIsSyncing(false);
            setSyncStatus("synced");
            setModalState({
              isOpen: true,
              status: "success",
              message: t("allDataSynced"),
            });
          })
          .catch(() => {
            setIsSyncing(false);
            setSyncStatus("offline");
            setModalState({
              isOpen: true,
              status: "error",
              message: t("cloudSyncFailed"),
            });
          });
      },
      onError: () => {
        setIsSyncing(false);
        setSyncStatus("offline");
        setModalState({
          isOpen: true,
          status: "error",
          message: t("cloudSyncFailed"),
        });
      },
    });
  };

  const handleNavigate = (
    e?: React.MouseEvent<HTMLAnchorElement>,
    href?: string,
  ) => {
    if (isGuest && href?.includes("/settings")) {
      e?.preventDefault();
      openLockModal(t("accountSettingsBackup"));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLogoutConfirm();
      }
    };
    if (logoutConfirmOpen) {
      globalThis.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [logoutConfirmOpen, closeLogoutConfirm]);

  const handleLogout = async () => {
    closeLogoutConfirm();
    if (isGuest) {
      setIsLoggingOutLocal(true);
      await clearGuestData();
      setGuestMode(false);
      queryClient.clear();
      toast.success(t("guestSessionCleared"));
      window.location.href = "/login";
    } else {
      setIsLoggingOutLocal(true);
      try {
        // Clear local data and cache BEFORE switching to guest mode to prevent UI flash
        await clearGuestData();
        queryClient.clear();

        // Set guest mode and seed default data
        setGuestMode(true);
        await useGuestStore.getState().seedDefaultGuestData();

        // Logout from server, which will trigger a hard reload to /home
        await logoutUserAsync();
      } catch (error) {
        console.error("Logout failed", error);
        toast.error(t("logoutFailed"));
      } finally {
        setIsLoggingOutLocal(false);
      }
    }
  };

  const isLoggingOut = isLogoutPending || isLoggingOutLocal;

  let loadingModalMessage: string | undefined;
  if (modalState.isOpen) {
    loadingModalMessage = modalState.message;
  } else if (isGuest) {
    loadingModalMessage = t("clearingSession");
  } else {
    loadingModalMessage = t("signingOut");
  }

  return (
    <>
      {/* Desktop Sidebar */}
      {isClientMounted && (
        <DesktopSidebar
          pathname={pathname}
          user={user}
          isLoading={isLoading}
          onLogout={openLogoutConfirm}
          isGuest={isGuest}
          isSyncing={isSyncing}
          syncStatus={syncStatus}
          onSyncClick={handleSyncClick}
          onNavigate={handleNavigate}
        />
      )}

      {/* Mobile Drawer Navigation overlay */}
      <MobileDrawer
        isOpen={isClientMounted && mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        pathname={pathname}
        user={user}
        isLoading={isLoading}
        onLogout={openLogoutConfirm}
        isGuest={isGuest}
        isSyncing={isSyncing}
        syncStatus={syncStatus}
        onSyncClick={handleSyncClick}
        onNavigate={handleNavigate}
      />

      {/* Mobile Bottom Navigation Bar */}
      {(pathname === "/home" ||
        pathname === "/journal" ||
        pathname === "/analytics" ||
        pathname === "/transaction") && (
        <MobileBottomNav
          pathname={pathname}
          mobileMenuOpen={mobileMenuOpen}
          onMenuOpen={() => setMobileMenuOpen((prev) => !prev)}
        />
      )}

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={logoutConfirmOpen}
        onClose={closeLogoutConfirm}
        onConfirm={handleLogout}
        icon={LogOut}
        title={t("signOutConfirmTitle")}
        des={isGuest ? t("clearSessionDesc") : t("signOutConfirmDesc")}
      />

      {/* Loading Modal for Logout & Manual Sync */}
      <LoadingModal
        isOpen={modalState.isOpen || isLoggingOut}
        status={modalState.isOpen ? modalState.status : "loading"}
        message={loadingModalMessage}
        onClose={resetModalState}
      />
    </>
  );
}
