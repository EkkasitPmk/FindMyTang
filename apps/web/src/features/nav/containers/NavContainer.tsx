"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
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
import {
  isCloudSyncQuery,
  ensureSyncSucceeded,
  performCloudSync,
  shouldPullCloudData,
} from "../helpers/sync.helper";
import {
  isGuestNavBlocked,
  shouldShowMobileBottomNav,
} from "../helpers/navigation.helper";
import { useTransactionSheetStore } from "@/features/transactions/hooks/transaction-sheet.hook";
import type { UserProfile } from "@/shared/lib/types/user.type";

const CLOUD_SYNC_INTERVAL_MS = 60_000;

export default function NavContainer({
  initialUser,
}: Readonly<{ initialUser: UserProfile | null }>) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user, isLoading, isError } = useMeQuery({ initialUser });
  const queryClient = useQueryClient();
  const { isGuest, setGuestMode, clearGuestData } = useGuestStore();
  const { t } = useTranslation();
  const isAuthenticated = Boolean(user);
  const isUserProfileLoading = isLoading || (isError && !isGuest);
  const openLockModal = useFeatureLockModal((state) => state.openModal);
  const openTransactionSheet = useTransactionSheetStore((state) => state.open);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileBottomNavHidden, setIsMobileBottomNavHidden] = useState(false);
  const shouldHideBottomNavOnScroll =
    pathname === "/dashboard" ||
    pathname === "/journal" ||
    pathname === "/analytics" ||
    pathname.startsWith("/analytics/category");

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("bottomnav:visibility", {
        detail: { hidden: isMobileBottomNavHidden },
      }),
    );
  }, [isMobileBottomNavHidden]);

  useEffect(() => {
    const showBottomNav = () => setIsMobileBottomNavHidden(false);
    window.addEventListener("bottomnav:show", showBottomNav);
    return () => window.removeEventListener("bottomnav:show", showBottomNav);
  }, []);

  useEffect(() => {
    const handleSessionExpired = async () => {
      if (isGuest) return;
      setGuestMode(true);
      await clearGuestData();
      await useGuestStore.getState().seedDefaultGuestData();
      queryClient.clear();
      toast.info(t("sessionExpired"));
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () =>
      window.removeEventListener("auth:session-expired", handleSessionExpired);
  }, [clearGuestData, isGuest, queryClient, setGuestMode, t]);

  useEffect(() => {
    if (!shouldHideBottomNavOnScroll) return;

    const SHOW_AFTER_SCROLL_UP = 150;
    const previousScrollPositions = new WeakMap<Element, number>();
    const upwardScrollDistances = new WeakMap<Element, number>();
    let previousWindowScrollTop = window.scrollY;
    let upwardWindowScrollDistance = 0;
    const visualViewport = window.visualViewport;
    const isKeyboardOpen = () =>
      Boolean(
        visualViewport &&
        Math.max(window.innerHeight, document.documentElement.clientHeight) -
          visualViewport.height >
          100,
      );
    const resetUpwardDistance = (scrollTarget?: Element) => {
      if (scrollTarget) upwardScrollDistances.delete(scrollTarget);
      else upwardWindowScrollDistance = 0;
    };
    const trackUpwardDistance = (
      scrollTarget: Element | undefined,
      distance: number,
    ) => {
      if (scrollTarget) upwardScrollDistances.set(scrollTarget, distance);
      else upwardWindowScrollDistance = distance;
    };

    const updateVisibility = (
      currentScrollTop: number,
      previousScrollTop: number,
      scrollTarget?: Element,
    ) => {
      if (isKeyboardOpen()) return;

      const scrollDelta = currentScrollTop - previousScrollTop;

      if (Math.abs(scrollDelta) > 300) {
        resetUpwardDistance(scrollTarget);
        return;
      }

      if (currentScrollTop <= 8) {
        setIsMobileBottomNavHidden(false);
        resetUpwardDistance(scrollTarget);
        return;
      }
      if (scrollDelta > 4) {
        setIsMobileBottomNavHidden(true);
        resetUpwardDistance(scrollTarget);
        return;
      }
      if (scrollDelta >= -4) return;

      const upwardDistance =
        (scrollTarget
          ? (upwardScrollDistances.get(scrollTarget) ?? 0)
          : upwardWindowScrollDistance) + Math.abs(scrollDelta);
      trackUpwardDistance(scrollTarget, upwardDistance);

      if (upwardDistance < SHOW_AFTER_SCROLL_UP) return;

      setIsMobileBottomNavHidden(false);
      resetUpwardDistance(scrollTarget);
    };

    const handleWindowScroll = () => {
      if (isKeyboardOpen()) return;

      const currentScrollTop = window.scrollY;
      updateVisibility(currentScrollTop, previousWindowScrollTop);
      previousWindowScrollTop = currentScrollTop;
    };

    const handleElementScroll = (event: Event) => {
      if (isKeyboardOpen()) return;

      if (!(event.target instanceof HTMLElement)) return;

      const target = event.target;
      const currentScrollTop = target.scrollTop;

      if (target.dataset.programmaticScroll === "true") {
        previousScrollPositions.set(target, currentScrollTop);
        return;
      }

      const previousScrollTop =
        previousScrollPositions.get(target) ?? currentScrollTop;
      updateVisibility(currentScrollTop, previousScrollTop, target);
      previousScrollPositions.set(target, currentScrollTop);
    };

    const handleViewportResize = () => {
      setIsMobileBottomNavHidden(false);
      previousWindowScrollTop = window.scrollY;
      upwardWindowScrollDistance = 0;
    };

    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    document.addEventListener("scroll", handleElementScroll, {
      passive: true,
      capture: true,
    });
    visualViewport?.addEventListener("resize", handleViewportResize);

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
      document.removeEventListener("scroll", handleElementScroll, {
        capture: true,
      });
      visualViewport?.removeEventListener("resize", handleViewportResize);
    };
  }, [pathname, shouldHideBottomNavOnScroll]);

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
    "idle" | "synced" | "syncing" | "failed"
  >("idle");
  const [isLoggingOutLocal, setIsLoggingOutLocal] = useState(false);
  const syncInFlightRef = useRef<Promise<void> | null>(null);
  const syncScheduleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cloudRevisionRef = useRef<number | null>(null);

  useEffect(() => {
    if (user?.syncRevision !== undefined) {
      cloudRevisionRef.current = user.syncRevision;
    }
  }, [user?.syncRevision]);

  const {
    isOpen: logoutConfirmOpen,
    open: openLogoutConfirm,
    close: closeLogoutConfirm,
  } = useConfirmModal();

  const { mutateAsync: logoutUserAsync, isPending: isLogoutPending } =
    useLogoutMutation({
      onSuccess: () => {
        window.location.replace("/dashboard");
      },
      onError: () => {
        setIsLoggingOutLocal(false);
      },
    });

  const { mutateAsync: syncUser } = useSyncUserMutation();

  const runCloudSync = useCallback(async () => {
    if (isGuest || !isAuthenticated) return;
    if (syncInFlightRef.current) return syncInFlightRef.current;

    setIsSyncing(true);
    setSyncStatus("syncing");

    const syncPromise = performCloudSync(async () => {
      const result = await syncUser();
      ensureSyncSucceeded(result);
      if (shouldPullCloudData(cloudRevisionRef.current, result.syncRevision)) {
        await queryClient.refetchQueries(
          {
            predicate: isCloudSyncQuery,
            type: "all",
          },
          { throwOnError: true },
        );
      }
      cloudRevisionRef.current = result.syncRevision;
    })
      .then(() => {
        setIsSyncing(false);
        setSyncStatus("synced");
      })
      .catch((error: unknown) => {
        setIsSyncing(false);
        setSyncStatus("failed");
        throw error;
      })
      .finally(() => {
        syncInFlightRef.current = null;
      });

    syncInFlightRef.current = syncPromise;
    return syncPromise;
  }, [isAuthenticated, isGuest, queryClient, syncUser]);

  const executeScheduledCloudSync = useCallback(() => {
    syncScheduleRef.current = null;
    void runCloudSync().catch(() => {});
  }, [runCloudSync]);

  const scheduleCloudSync = useCallback(() => {
    if (syncScheduleRef.current) clearTimeout(syncScheduleRef.current);
    syncScheduleRef.current = setTimeout(executeScheduledCloudSync, 250);
  }, [executeScheduledCloudSync]);

  const runPeriodicCloudSync = useCallback(() => {
    void runCloudSync().catch(() => {});
  }, [runCloudSync]);

  useEffect(() => {
    if (isGuest || !isAuthenticated) return;

    let syncInterval: ReturnType<typeof setInterval> | null = null;

    const startPeriodicSync = () => {
      if (syncInterval || document.visibilityState !== "visible") return;
      syncInterval = setInterval(runPeriodicCloudSync, CLOUD_SYNC_INTERVAL_MS);
    };

    const stopPeriodicSync = () => {
      if (!syncInterval) return;
      clearInterval(syncInterval);
      syncInterval = null;
    };

    scheduleCloudSync();
    startPeriodicSync();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        scheduleCloudSync();
        startPeriodicSync();
      } else {
        stopPeriodicSync();
      }
    };

    globalThis.addEventListener("online", scheduleCloudSync);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      globalThis.removeEventListener("online", scheduleCloudSync);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (syncScheduleRef.current) clearTimeout(syncScheduleRef.current);
      stopPeriodicSync();
    };
  }, [isAuthenticated, isGuest, runPeriodicCloudSync, scheduleCloudSync]);

  const handleSyncClick = () => {
    if (isGuest) {
      openLockModal(t("cloudSyncBackup"));
      return;
    }
    void runCloudSync().catch(() => {});
  };

  const handleNavigate = (
    e?: React.MouseEvent<HTMLAnchorElement>,
    href?: string,
  ) => {
    if (
      href === "/transaction" &&
      window.matchMedia("(min-width: 1024px)").matches
    ) {
      e?.preventDefault();
      openTransactionSheet();
      return;
    }

    if (href && isGuestNavBlocked(href, isGuest)) {
      e?.preventDefault();
      openLockModal(t("accountSettingsBackup"));
      return;
    }

    if (href) setIsMobileBottomNavHidden(false);
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
      await queryClient.cancelQueries();
      queryClient.clear();
      await clearGuestData();
      setGuestMode(true);
      toast.success(t("guestSessionCleared"));
      router.push("/login");
    } else {
      setIsLoggingOutLocal(true);
      try {
        await queryClient.cancelQueries();
        queryClient.clear();

        setGuestMode(true);
        await clearGuestData();
        await useGuestStore.getState().seedDefaultGuestData();

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

  const loadingModalMessage = isGuest ? t("clearingSession") : t("signingOut");

  return (
    <>
      {/* Desktop Sidebar */}
      <DesktopSidebar
        pathname={pathname}
        user={user}
        isLoading={isUserProfileLoading}
        onLogout={openLogoutConfirm}
        isGuest={isGuest}
        isSyncing={isSyncing}
        syncStatus={syncStatus}
        lastSyncedAt={user?.lastSyncedAt}
        onSyncClick={handleSyncClick}
        onNavigate={handleNavigate}
      />

      {/* Mobile Drawer Navigation overlay */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        pathname={pathname}
        user={user}
        isLoading={isUserProfileLoading}
        onLogout={openLogoutConfirm}
        isGuest={isGuest}
        isSyncing={isSyncing}
        syncStatus={syncStatus}
        lastSyncedAt={user?.lastSyncedAt}
        onSyncClick={handleSyncClick}
        onNavigate={handleNavigate}
      />

      {/* Mobile Bottom Navigation Bar */}
      {shouldShowMobileBottomNav(pathname) && (
        <MobileBottomNav
          pathname={pathname}
          mobileMenuOpen={mobileMenuOpen}
          isHidden={shouldHideBottomNavOnScroll && isMobileBottomNavHidden}
          onMenuOpen={() => setMobileMenuOpen((prev) => !prev)}
          onNavigate={() => setIsMobileBottomNavHidden(false)}
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

      {/* Loading Modal for logout only */}
      <LoadingModal
        isOpen={isLoggingOut}
        status="loading"
        message={loadingModalMessage}
      />
    </>
  );
}
