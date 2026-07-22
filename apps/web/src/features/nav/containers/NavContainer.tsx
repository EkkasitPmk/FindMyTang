"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { LogOut } from "lucide-react";
import { useLogoutMutation } from "../hooks/auth.hook";
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

export default function NavContainer() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOutLocal, setIsLoggingOutLocal] = useState(false);
  const {
    isOpen: logoutConfirmOpen,
    open: openLogoutConfirm,
    close: closeLogoutConfirm,
  } = useConfirmModal();
  const isGuest = useGuestStore((state) => state.isGuest);
  const setGuestMode = useGuestStore((state) => state.setGuestMode);
  const clearGuestData = useGuestStore((state) => state.clearGuestData);
  const openLockModal = useFeatureLockModal((state) => state.openModal);
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<
    "synced" | "syncing" | "offline"
  >("offline");

  const handleSyncClick = () => {
    if (isGuest) {
      openLockModal(t("cloudSyncBackup"));
      return;
    }

    setIsSyncing(true);
    setSyncStatus("syncing");

    void queryClient
      .refetchQueries()
      .then(() => {
        setIsSyncing(false);
        setSyncStatus("synced");
        toast.success(t("allDataSynced"));
      })
      .catch(() => {
        setIsSyncing(false);
        setSyncStatus("offline");
        toast.error(t("cloudSyncFailed"));
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

  const { data: user, isLoading } = useMeQuery();

  const { mutateAsync: logoutUserAsync, isPending: isLogoutPending } =
    useLogoutMutation({
      onSuccess: () => {
        toast.success(t("logoutSuccessOffline"));
        window.location.href = "/home";
      },
      onError: () => {
        toast.error(t("logoutFailed"));
        setIsLoggingOutLocal(false);
      },
    });

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

  return (
    <>
      {/* Desktop Sidebar */}
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

      {/* Mobile Drawer Navigation overlay */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
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
          onMenuOpen={() => setMobileMenuOpen(true)}
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

      {/* Loading Modal for Logout */}
      <LoadingModal
        isOpen={isLoggingOut}
        message={isGuest ? t("clearingSession") : t("signingOut")}
      />
    </>
  );
}
