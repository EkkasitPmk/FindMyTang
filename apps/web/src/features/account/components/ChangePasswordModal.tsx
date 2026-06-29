import { X, Loader2, Eye, EyeOff } from "lucide-react";
import {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrors,
} from "react-hook-form";
import { ChangePasswordFormValues } from "../schemas/account.schema";
import { useTranslation } from "@/shared/lib/i18n/useTranslation";
import { Input } from "@/shared/components/customs/Input";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  register: UseFormRegister<ChangePasswordFormValues>;
  handleSubmit: UseFormHandleSubmit<ChangePasswordFormValues>;
  onSubmit: (values: ChangePasswordFormValues) => void;
  errors: FieldErrors<ChangePasswordFormValues>;
  isPending: boolean;
  showCurrent: boolean;
  showNew: boolean;
  showConfirm: boolean;
  onToggleShowCurrent: () => void;
  onToggleShowNew: () => void;
  onToggleShowConfirm: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
  register,
  handleSubmit,
  onSubmit,
  errors,
  isPending,
  showCurrent,
  showNew,
  showConfirm,
  onToggleShowCurrent,
  onToggleShowNew,
  onToggleShowConfirm,
}: Readonly<ChangePasswordModalProps>) {
  const { t } = useTranslation();

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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative bg-surface border border-border rounded-lg shadow-lg max-w-sm w-full animate-subtle-pop z-10"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <span className="text-lg font-medium text-foreground">
            {t("changePassword")}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary-text hover:text-foreground cursor-pointer transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-secondary-text font-semibold uppercase tracking-wider">
              {t("currentPasswordLabel")}
            </p>
            <div className="relative flex items-center">
              <Input
                type={showCurrent ? "text" : "password"}
                placeholder={t("placeholderCurrentPassword")}
                disabled={isPending}
                className="pr-10"
                error={!!errors.currentPassword}
                {...register("currentPassword")}
              />
              <button
                type="button"
                onClick={onToggleShowCurrent}
                disabled={isPending}
                className="absolute right-3 p-1 text-secondary-text/60 hover:text-secondary-text rounded-full transition-colors cursor-pointer flex items-center justify-center"
                title={showCurrent ? t("hidePassword") : t("showPassword")}
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs text-expense mt-0.5">
                {errors.currentPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-xs text-secondary-text font-semibold uppercase tracking-wider">
              {t("newPasswordLabel")}
            </p>
            <div className="relative flex items-center">
              <Input
                type={showNew ? "text" : "password"}
                placeholder={t("placeholderNewPassword")}
                disabled={isPending}
                className="pr-10"
                error={!!errors.newPassword}
                {...register("newPassword")}
              />
              <button
                type="button"
                onClick={onToggleShowNew}
                disabled={isPending}
                className="absolute right-3 p-1 text-secondary-text/60 hover:text-secondary-text rounded-full transition-colors cursor-pointer flex items-center justify-center"
                title={showNew ? t("hidePassword") : t("showPassword")}
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-expense mt-0.5">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-xs text-secondary-text font-semibold uppercase tracking-wider">
              {t("confirmNewPasswordLabel")}
            </p>
            <div className="relative flex items-center">
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder={t("placeholderConfirmNewPassword")}
                disabled={isPending}
                className="pr-10"
                error={!!errors.confirmNewPassword}
                {...register("confirmNewPassword")}
              />
              <button
                type="button"
                onClick={onToggleShowConfirm}
                disabled={isPending}
                className="absolute right-3 p-1 text-secondary-text/60 hover:text-secondary-text rounded-full transition-colors cursor-pointer flex items-center justify-center"
                title={showConfirm ? t("hidePassword") : t("showPassword")}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmNewPassword && (
              <p className="text-xs text-expense mt-0.5">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 px-6 py-4 bg-background/50 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="w-full border border-border rounded-md py-2 text-sm hover:bg-muted transition-colors cursor-pointer text-foreground bg-background disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("cancelBtn")}
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary hover:bg-primary-dark text-white rounded-md py-2 text-sm font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            {t("saveChanges")}
          </button>
        </div>
      </form>
    </div>
  );
}
