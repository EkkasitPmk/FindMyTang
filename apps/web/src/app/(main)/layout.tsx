"use client";
import ShowProfileContainer from "@/features/account/containers/ShowProfileContainer";
import NavContainer from "@/features/nav/containers/NavContainer";
import { cn } from "@/shared/utils";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  return (
    <div className="bg-background text-on-background flex flex-col font-sans relative overflow-x-hidden">
      {/* Subtle brand color glow - very light opacity, surgical accent */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-primary-container/2 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] rounded-full bg-tertiary-container/1 blur-[120px] pointer-events-none" />

      {/* Main Shell Container */}
      <div className="flex flex-1 relative z-10">
        {/* Navigation components (Sidebar, Drawer, Bottom Nav, Modals) */}
        <NavContainer />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <ShowProfileContainer />

          {/* Child Content */}
          <main
            className={cn(
              "flex-1 overflow-y-auto max-w-6xl w-full mx-auto md:pb-8",
              pathname === "/account" || pathname === "/assets/new"
                ? "px-0 py-4 md:p-8"
                : "p-4 md:p-8 pb-20 pt-15",
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
