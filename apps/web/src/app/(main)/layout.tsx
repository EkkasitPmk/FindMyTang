"use client";
import ShowProfileContainer from "@/features/account/containers/ShowProfileContainer";
import NavContainer from "@/features/nav/containers/NavContainer";
import TopAppBarMobile from "@/shared/components/custom/TopAppBarMobile";
import { cn } from "@/shared/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useRef, useEffect } from "react";
import { EllipsisVertical, X } from "lucide-react";
import { useCategoryUIStore } from "@/features/category/hooks/category.hook";
import { useTranslation } from "@/shared/lib/i18n/useTranslation";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const isEditingList = useCategoryUIStore((state) => state.isEditingList);
  const toggleEditingList = useCategoryUIStore(
    (state) => state.toggleEditingList,
  );
  const { t } = useTranslation();

  const isMainTab = [
    "/home",
    "/journal",
    "/analytics",
    "/transaction",
  ].includes(pathname);
  const shouldShowTopAppBar = !isMainTab;

  const getMobileTitle = (path: string) => {
    if (path === "/categories") return t("manageCategories");
    if (path === "/assets/new") return t("newAssets");
    if (path === "/settings/account") return t("account");
    if (path === "/settings") return t("navSettings");
    if (path === "/assets") return "Asset Detail"; // Default if Suspense falls back
    return "";
  };
  const mobileTitle = getMobileTitle(pathname);

  const renderRightAction = () => {
    if (pathname === "/categories") {
      return (
        <button
          type="button"
          onClick={toggleEditingList}
          className="text-sm mr-4 text-primary hover:text-primary-dark font-medium transition-colors cursor-pointer"
        >
          {isEditingList ? t("done") : t("edit")}
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
    if (pathname === "/assets") {
      return <AssetsMenu />;
    }
    return null;
  };

  return (
    <div className="text-primary-text flex flex-col font-sans relative overflow-x-hidden min-h-screen flex-1">
      {/* Subtle brand color glow - very light opacity, surgical accent */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-primary-light/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] rounded-full bg-accent-light/10 blur-[120px] pointer-events-none" />

      {/* Main Shell Container */}
      <div className="flex flex-1 relative z-10">
        {/* Navigation components (Sidebar, Drawer, Bottom Nav, Modals) */}
        <NavContainer />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {isMainTab && pathname !== "/transaction" && <ShowProfileContainer />}

          {/* Child Content */}
          <main
            className={cn(
              "flex-1 overflow-y-auto max-h-screen w-full mx-auto md:pb-8",
              isMainTab
                ? cn(
                    "md:p-8 pb-20",
                    pathname === "/transaction" ? "py-3" : "py-3 pt-15",
                  )
                : "px-0 py-3 md:p-8",
            )}
          >
            {shouldShowTopAppBar && (
              <Suspense
                fallback={
                  <TopAppBarMobile
                    title={mobileTitle}
                    showBackButton={pathname !== "/settings"}
                    onBack={() => router.back()}
                    rightAction={renderRightAction()}
                  />
                }
              >
                <DynamicTopAppBar
                  baseTitle={mobileTitle}
                  pathname={pathname}
                  onBack={() => router.back()}
                  rightAction={renderRightAction()}
                />
              </Suspense>
            )}

            <div className="px-4 py-2">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

function DynamicTopAppBar({
  baseTitle,
  pathname,
  onBack,
  rightAction,
}: {
  baseTitle: string;
  pathname: string;
  onBack: () => void;
  rightAction: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const title =
    pathname === "/assets" && searchParams.get("name")
      ? searchParams.get("name")!
      : baseTitle;

  return (
    <TopAppBarMobile
      title={title}
      showBackButton={pathname !== "/settings"}
      onBack={onBack}
      rightAction={rightAction}
    />
  );
}

function AssetsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="p-1 mr-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <EllipsisVertical size={18} />
      </button>
      {isOpen && (
        <div className="absolute right-3 top-full flex flex-col items-start w-32 bg-white rounded-md py-2 shadow-md z-50 border border-gray-100">
          <button
            type="button"
            className="text-sm py-1 px-3 w-full text-left hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Filter
          </button>
          <button
            type="button"
            className="text-sm py-1 px-3 w-full text-left hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Search
          </button>
          <button
            type="button"
            className="text-sm py-1 px-3 w-full text-left hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Sort
          </button>
          <button
            type="button"
            className="text-sm py-1 px-3 w-full text-left hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Archive Asset
          </button>
          <button
            type="button"
            className="text-sm py-1 px-3 w-full text-left hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Delete Asset
          </button>
        </div>
      )}
    </div>
  );
}
