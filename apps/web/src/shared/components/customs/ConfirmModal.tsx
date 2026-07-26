import { LucideIcon } from "lucide-react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { Checkbox } from "@/shared/components/animate-ui/components/radix/checkbox";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/shared/components/animate-ui/components/radix/alert-dialog";

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

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <AlertDialogContent className="w-[calc(100%-2.5rem)] max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <AlertDialogHeader className="flex flex-col items-center text-center gap-3">
          <div
            className={`w-12 h-12 rounded-full ${colors.bgLight} ${colors.text} flex items-center justify-center mb-1`}
          >
            <Icon className="w-6 h-6" strokeWidth={1.5} />
          </div>

          <div className="space-y-1.5">
            <AlertDialogTitle className="text-base font-bold text-primary-text">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-secondary-text/85 leading-relaxed text-center">
              {des}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {withHardDeleteOption && (
          <div className="w-full flex flex-col gap-3 mt-2 text-left">
            <div className="flex items-center gap-2">
              <Checkbox
                id="hard-delete-option"
                size="sm"
                checked={isHardDelete}
                onCheckedChange={(checked) =>
                  onHardDeleteChange?.(Boolean(checked))
                }
              />
              <label
                htmlFor="hard-delete-option"
                className="text-xs font-medium text-primary-text cursor-pointer select-none"
              >
                {hardDeleteCheckboxLabel}
              </label>
            </div>

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

        <AlertDialogFooter className="flex gap-3 w-full mt-2 sm:flex-row flex-row">
          <Button
            variant="unstyled"
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-md border border-border hover:bg-surface-secondary text-secondary-text text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="unstyled"
            type="button"
            onClick={() => onConfirm(isHardDelete)}
            disabled={Boolean(isConfirmDisabled)}
            className={`flex-1 py-2.5 px-4 rounded-md text-xs font-semibold transition-colors ${
              isConfirmDisabled
                ? `${colors.disabledBg} text-white/70 cursor-not-allowed`
                : `${colors.bg} ${colors.hoverBg} text-white cursor-pointer`
            }`}
          >
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
