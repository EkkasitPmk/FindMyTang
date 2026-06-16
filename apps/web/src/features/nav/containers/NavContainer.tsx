"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DesktopSidebar from "../components/DesktopSidebar";
import MobileDrawer from "../components/MobileDrawer";
import MobileBottomNav from "../components/MobileBottomNav";
import { useMeQuery, useLogoutMutation } from "@/features/nav/hooks/auth.hook";

interface NavContainerProps {
  children: React.ReactNode;
}

export default function NavContainer({
  children,
}: Readonly<NavContainerProps>) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans">
      {/* Subtle brand color glow - very light opacity, surgical accent */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-primary-container/2 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] rounded-full bg-tertiary-container/1 blur-[120px] pointer-events-none" />

      {/* Main Shell Container */}
      <div className="flex flex-1 relative z-10">
        {/* Desktop Sidebar */}
        <DesktopSidebar
          pathname={pathname}
          user={user}
          isLoading={isLoading}
          onLogout={() => logoutUser()}
        />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Child Content */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-6xl w-full mx-auto pb-24 md:pb-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Drawer Navigation overlay */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        pathname={pathname}
        user={user}
        isLoading={isLoading}
        onLogout={() => logoutUser()}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        pathname={pathname}
        mobileMenuOpen={mobileMenuOpen}
        onMenuOpen={() => setMobileMenuOpen(true)}
      />
    </div>
  );
}
