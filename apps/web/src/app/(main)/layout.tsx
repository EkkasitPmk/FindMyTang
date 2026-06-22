"use client";
import ShowProfileContainer from "@/features/account/containers/ShowProfileContainer";
import NavContainer from "@/features/nav/containers/NavContainer";
import TopAppBarMobile from "@/shared/components/custom/TopAppBarMobile";
import { cn } from "@/shared/utils";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  return (
    <div className="text-primary-text flex flex-col font-sans relative overflow-x-hidden">
      {/* Subtle brand color glow - very light opacity, surgical accent */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-primary-light/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] rounded-full bg-accent-light/10 blur-[120px] pointer-events-none" />

      {/* Main Shell Container */}
      <div className="flex flex-1 relative z-10">
        {/* Navigation components (Sidebar, Drawer, Bottom Nav, Modals) */}
        <NavContainer />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {(pathname === "/home" ||
            pathname === "/journal" ||
            pathname === "/analytics") && <ShowProfileContainer />}

          {/* Child Content */}
          <main
            className={cn(
              "flex-1 overflow-y-auto max-h-screen w-full mx-auto md:pb-8",
              pathname === "/home" ||
                pathname === "/journal" ||
                pathname === "/analytics"
                ? "py-3 md:p-8 pb-20 pt-15"
                : "px-0 py-3 md:p-8",
            )}
          >
            {pathname !== "/home" &&
              pathname !== "/journal" &&
              pathname !== "/analytics" &&
              pathname !== "/transaction" && (
                <TopAppBarMobile
                  href="home"
                  title={
                    pathname === "/categories"
                      ? "Category"
                      : pathname === "/assets/new"
                        ? "New Assets"
                        : pathname === "/account"
                          ? "Account"
                          : ""
                  }
                />
              )}

            <div className="px-4">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
