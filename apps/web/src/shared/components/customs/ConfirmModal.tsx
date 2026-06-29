import { LucideIcon, Check } from "lucide-react";
import { useState } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (isHardDelete?: boolean) => void;
  icon: LucideIcon;
  title: string;
  des: string;
  confirmLabel?: string;
  withHardDeleteOption?: boolean;
  hardDeleteCheckboxLabel?: string;
  expectedInputToConfirm?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  icon: Icon,
  title,
  des,
  confirmLabel = "Log Out",
  withHardDeleteOption,
  hardDeleteCheckboxLabel = "Delete permanently",
  expectedInputToConfirm,
}: Readonly<ConfirmModalProps>) {
  const [isHardDelete, setIsHardDelete] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleClose = () => {
    setIsHardDelete(false);
    setInputValue("");
    onClose();
  };

  if (!isOpen) {
    if (isHardDelete) setIsHardDelete(false);
    if (inputValue !== "") setInputValue("");
    return null;
  }

  const isConfirmDisabled =
    withHardDeleteOption &&
    isHardDelete &&
    expectedInputToConfirm &&
    inputValue !== expectedInputToConfirm;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-primary-text/20 backdrop-blur-xs transition-opacity duration-300">
      {/* Click outside to close */}
      <div
        className="absolute inset-0 cursor-default"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative bg-surface border border-border rounded-lg shadow-lg max-w-sm w-full p-6 animate-subtle-pop z-10">
        <div className="flex flex-col items-center text-center gap-4">
          {/* Accent red container for logout action */}
          <div className="w-12 h-12 rounded-full bg-expense-light text-expense flex items-center justify-center mb-1">
            <Icon className="w-6 h-6" strokeWidth={1.5} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-primary-text">{title}</h3>
            <p className="text-xs text-secondary-text/85 leading-relaxed">
              {des}
            </p>
          </div>

          {withHardDeleteOption && (
            <div className="w-full flex flex-col gap-3 mt-2 text-left">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
                    isHardDelete
                      ? "bg-expense border-expense text-white"
                      : "border-border bg-surface group-hover:border-expense"
                  }`}
                >
                  {isHardDelete && <Check size={12} strokeWidth={3} />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={isHardDelete}
                  onChange={(e) => setIsHardDelete(e.target.checked)}
                />
                <span className="text-xs font-medium text-primary-text">
                  {hardDeleteCheckboxLabel}
                </span>
              </label>

              {isHardDelete && expectedInputToConfirm && (
                <div className="flex flex-col gap-1.5 animate-subtle-pop">
                  <span className="text-[11px] text-secondary-text">
                    Type <strong>{expectedInputToConfirm}</strong> to confirm
                  </span>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={expectedInputToConfirm}
                    className="w-full px-3 py-2 text-xs border border-border rounded-md bg-surface-secondary focus:outline-none focus:border-expense focus:ring-1 focus:ring-expense transition-all"
                  />
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 w-full mt-4">
            <button
              onClick={handleClose}
              className="flex-1 py-2.5 px-4 rounded-md border border-border hover:bg-surface-secondary text-secondary-text text-xs font-semibold active-press transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(isHardDelete)}
              disabled={Boolean(isConfirmDisabled)}
              className={`flex-1 py-2.5 px-4 rounded-md text-xs font-semibold transition-colors ${
                isConfirmDisabled
                  ? "bg-expense/50 text-white/70 cursor-not-allowed"
                  : "bg-expense hover:bg-expense/95 text-white active-press cursor-pointer"
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
