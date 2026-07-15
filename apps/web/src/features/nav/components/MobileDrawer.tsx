import { Wallet, X } from "lucide-react";
import NavLinks from "./NavLinks";
import ThemeSwitcher from "@/shared/components/customs/ThemeSwitcher";
import NavUserProfile from "./NavUserProfile";
import { UserProfile } from "@/features/nav/types/auth.type";
import { Button } from "@/shared/components/customs/Button";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  user?: UserProfile | null;
  isLoading: boolean;
  onLogout: () => void;
}

export default function MobileDrawer({
  isOpen,
  onClose,
  pathname,
  user,
  isLoading,
  onLogout,
}: Readonly<MobileDrawerProps>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <Button
        variant="unstyled"
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
        className="fixed inset-0 bg-primary-text/25 backdrop-blur-xs w-full h-full border-none p-0 outline-none"
      />

      {/* Drawer */}
      <div className="fixed top-0 bottom-0 left-0 z-50 w-64 max-w-[80vw] bg-surface border-r border-border p-4 flex flex-col justify-between animate-in slide-in-from-left duration-200">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 w-8 h-8 rounded-md flex items-center justify-center">
                <Wallet className="w-4 h-4 text-primary" />
              </div>
              <span className="text-base font-bold tracking-tight text-primary-text">
                PocketNote
              </span>
            </div>
            <Button
              variant="unstyled"
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-surface-secondary text-secondary-text"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </Button>
          </div>

          {/* Navigation list */}
          <NavLinks
            pathname={pathname}
            onLinkClick={onClose}
            itemClassName="py-2"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="px-4">
            <ThemeSwitcher />
          </div>
          {/* User profile & Action */}
          <NavUserProfile
            user={user}
            isLoading={isLoading}
            onLogout={onLogout}
            onActionClick={onClose}
            className="pt-4 border-t border-border"
          />
        </div>
      </div>
    </div>
  );
}
