import { useMounted } from "@/shared/lib/hooks/useMounted.hook";
import { LucideIcon, Check } from "lucide-react";
import { createPortal } from "react-dom";

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
  variant?: "danger" | "success" | "primary" | "warning";
  isHardDelete?: boolean;
  onHardDeleteChange?: (value: boolean) => void;
  inputValue?: string;
  onInputChange?: (value: string) => void;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  icon: Icon,
  title,
  des,
  confirmLabel = "Sign out",
  withHardDeleteOption,
  hardDeleteCheckboxLabel = "Delete permanently",
  expectedInputToConfirm,
  variant = "danger",
  isHardDelete = false,
  onHardDeleteChange,
  inputValue = "",
  onInputChange,
}: Readonly<ConfirmModalProps>) {
  const mounted = useMounted();

  if (!isOpen || !mounted) return null;

  const isConfirmDisabled =
    withHardDeleteOption &&
    isHardDelete &&
    expectedInputToConfirm &&
    inputValue !== expectedInputToConfirm;

  const colorMap = {
    danger: {
      bg: "bg-expense",
      text: "text-expense",
      bgLight: "bg-expense-light",
      border: "border-expense",
      hoverBg: "hover:bg-expense/95",
      disabledBg: "bg-expense/50",
      focusRing: "focus:ring-expense",
      focusBorder: "focus:border-expense",
    },
    success: {
      bg: "bg-income",
      text: "text-income",
      bgLight: "bg-income-light",
      border: "border-income",
      hoverBg: "hover:bg-income/95",
      disabledBg: "bg-income/50",
      focusRing: "focus:ring-income",
      focusBorder: "focus:border-income",
    },
    primary: {
      bg: "bg-primary",
      text: "text-primary",
      bgLight: "bg-primary-light",
      border: "border-primary",
      hoverBg: "hover:bg-primary/95",
      disabledBg: "bg-primary/50",
      focusRing: "focus:ring-primary",
      focusBorder: "focus:border-primary",
    },
    warning: {
      bg: "bg-investment",
      text: "text-investment",
      bgLight: "bg-investment-light",
      border: "border-investment",
      hoverBg: "hover:bg-investment",
      disabledBg: "bg-investment/50",
      focusRing: "focus:ring-investment",
      focusBorder: "focus:border-investment",
    },
  };

  const colors = colorMap[variant];

  const modalContent = (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-primary-text/20 backdrop-blur-xs transition-opacity duration-300">
      {/* Click outside to close */}
      <div
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative bg-surface border border-border rounded-lg shadow-lg max-w-sm w-full p-6 animate-subtle-pop z-10">
        <div className="flex flex-col items-center text-center gap-3">
          {/* Accent container for action */}
          <div
            className={`w-12 h-12 rounded-full ${colors.bgLight} ${colors.text} flex items-center justify-center mb-1`}
          >
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
              <label className="flex gap-2 cursor-pointer group">
                <div
                  className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
                    isHardDelete
                      ? `${colors.bg} ${colors.border} text-white`
                      : `border-border bg-surface group-hover:${colors.border}`
                  }`}
                >
                  {isHardDelete && (
                    <Check size={12} strokeWidth={3} className="text-white" />
                  )}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={isHardDelete}
                  onChange={(e) => onHardDeleteChange?.(e.target.checked)}
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
                    onChange={(e) => onInputChange?.(e.target.value)}
                    placeholder={expectedInputToConfirm}
                    className={`w-full px-3 py-2 text-xs border border-border rounded-md bg-surface-secondary focus:outline-none ${colors.focusBorder} focus:ring-1 ${colors.focusRing} transition-all`}
                  />
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 w-full mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-md border border-border hover:bg-surface-secondary text-secondary-text text-xs font-semibold active-press transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirm(isHardDelete)}
              disabled={Boolean(isConfirmDisabled)}
              className={`flex-1 py-2.5 px-4 rounded-md text-xs font-semibold transition-colors ${
                isConfirmDisabled
                  ? `${colors.disabledBg} text-white/70 cursor-not-allowed`
                  : `${colors.bg} ${colors.hoverBg} text-white active-press cursor-pointer`
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
