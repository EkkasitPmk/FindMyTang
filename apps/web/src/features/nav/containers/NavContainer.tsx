"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { LogOut } from "lucide-react";
import { useMeQuery, useLogoutMutation } from "../hooks/auth.hook";
import { useGuestStore } from "@/shared/lib/store/guest-store";
import DesktopSidebar from "../components/DesktopSidebar";
import MobileBottomNav from "../components/MobileBottomNav";
import MobileDrawer from "../components/MobileDrawer";
import ConfirmModal from "@/shared/components/custom/ConfirmModal";

export default function NavContainer() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const isGuest = useGuestStore((state) => state.isGuest);
  const setGuestMode = useGuestStore((state) => state.setGuestMode);
  const clearGuestData = useGuestStore((state) => state.clearGuestData);

  const { data: user, isLoading } = useMeQuery();

  const { mutate: logoutUser } = useLogoutMutation({
    onSuccess: () => {
      toast.success("Successfully logged out");
      router.push("/login");
    },
    onError: () => {
      toast.error("Logout failed. Please try again.");
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLogoutConfirmOpen(false);
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
  }, [logoutConfirmOpen]);

  const handleLogout = () => {
    setLogoutConfirmOpen(false);
    if (isGuest) {
      setGuestMode(false);
      clearGuestData();
      toast.success("Guest session cleared");
      router.push("/login");
    } else {
      logoutUser();
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <DesktopSidebar
        pathname={pathname}
        user={user}
        isLoading={isLoading}
        onLogout={() => setLogoutConfirmOpen(true)}
      />

      {/* Mobile Drawer Navigation overlay */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        pathname={pathname}
        user={user}
        isLoading={isLoading}
        onLogout={() => setLogoutConfirmOpen(true)}
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
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
        icon={LogOut}
        title="Log Out?"
        des="Are you sure you want to log out of your account?"
      />
    </>
  );
}
