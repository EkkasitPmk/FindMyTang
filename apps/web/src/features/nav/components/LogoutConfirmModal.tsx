import { LogOut } from "lucide-react";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: Readonly<LogoutConfirmModalProps>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-primary-text/20 backdrop-blur-xs transition-opacity duration-300">
      {/* Click outside to close */}
      <div
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative bg-surface border border-border rounded-xl shadow-lg max-w-sm w-full p-6 animate-subtle-pop z-10">
        <div className="flex flex-col items-center text-center gap-4">
          {/* Accent red container for logout action */}
          <div className="w-12 h-12 rounded-full bg-expense-light text-expense flex items-center justify-center mb-1">
            <LogOut className="w-6 h-6" strokeWidth={1.5} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-primary-text">Log Out?</h3>
            <p className="text-xs text-secondary-text/85 leading-relaxed">
              Are you sure you want to log out of your account?
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 w-full mt-4">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-md border border-border hover:bg-surface-secondary text-secondary-text text-xs font-semibold active-press transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 px-4 rounded-md bg-expense hover:bg-expense/95 text-white text-xs font-semibold active-press transition-colors cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
