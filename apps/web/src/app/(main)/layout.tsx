"use client";
import ShowProfileContainer from "@/features/account/containers/ShowProfileContainer";
import NavContainer from "@/features/nav/containers/NavContainer";
import TopAppBarMobile from "@/shared/components/custom/TopAppBarMobile";
import { cn } from "@/shared/utils";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useCategoryUIStore } from "@/features/category/hooks/category.hook";

const TITLE_MAP: Record<string, string> = {
  "/categories": "Category",
  "/assets/new": "New Assets",
  "/settings/account": "Account",
  "/settings": "Settings",
};

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const isEditingList = useCategoryUIStore((state) => state.isEditingList);
  const toggleEditingList = useCategoryUIStore(
    (state) => state.toggleEditingList,
  );

  const isMainTab = ["/home", "/journal", "/analytics"].includes(pathname);
  const shouldShowTopAppBar = !isMainTab && pathname !== "/transaction";
  const mobileTitle = TITLE_MAP[pathname] || "";

  const renderRightAction = () => {
    if (pathname === "/categories") {
      return (
        <button
          type="button"
          onClick={toggleEditingList}
          className="text-sm mr-4 text-primary hover:text-primary-dark font-medium transition-colors cursor-pointer"
        >
          {isEditingList ? "Done" : "Edit"}
        </button>
      );
    }
    if (pathname === "/settings") {
      return (
        <button
          type="button"
          onClick={() => router.back()}
          className="p-1 mr-1 cursor-pointer"
        >
          <X size={24} />
        </button>
      );
    }
    return null;
  };

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
          {isMainTab && <ShowProfileContainer />}

          {/* Child Content */}
          <main
            className={cn(
              "flex-1 overflow-y-auto max-h-screen w-full mx-auto md:pb-8",
              isMainTab ? "py-3 md:p-8 pb-20 pt-15" : "px-0 py-3 md:p-8",
            )}
          >
            {shouldShowTopAppBar && (
              <TopAppBarMobile
                title={mobileTitle}
                showBackButton={pathname !== "/settings"}
                onBack={() => router.back()}
                rightAction={renderRightAction()}
              />
            )}

            <div className="px-4 py-2">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
