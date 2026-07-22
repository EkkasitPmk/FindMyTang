import { Loader2, Eye, EyeOff } from "lucide-react";
import {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrors,
} from "react-hook-form";
import { ChangePasswordFormValues } from "../schemas/account.form.schema";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { Input } from "@/shared/components/customs/Input";
import { Button } from "@/shared/components/customs/Button";
import { ModalForm } from "@/shared/components/customs/ModalForm";

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

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title={t("changePassword")}
      onSubmit={handleSubmit(onSubmit)}
      headerClassName="px-6 py-4 border-b border-border bg-surface"
      footerClassName="flex items-center gap-2 px-6 py-4 bg-background/50 border-t border-border mt-auto"
      className="max-w-sm rounded-lg"
      footer={
        <>
          <Button
            variant="unstyled"
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="w-full border border-border rounded-md py-2 text-sm hover:bg-muted transition-colors cursor-pointer text-foreground bg-background disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("cancelBtn")}
          </Button>
          <Button
            variant="unstyled"
            type="submit"
            disabled={isPending}
            className="w-full bg-primary hover:bg-primary-dark text-white rounded-md py-2 text-sm font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            {t("saveChanges")}
          </Button>
        </>
      }
    >
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
          <Button
            variant="unstyled"
            type="button"
            onClick={onToggleShowCurrent}
            disabled={isPending}
            className="absolute right-3 p-1 text-secondary-text/60 hover:text-secondary-text rounded-full transition-colors cursor-pointer flex items-center justify-center"
            title={showCurrent ? t("hidePassword") : t("showPassword")}
          >
            {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
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
          <Button
            variant="unstyled"
            type="button"
            onClick={onToggleShowNew}
            disabled={isPending}
            className="absolute right-3 p-1 text-secondary-text/60 hover:text-secondary-text rounded-full transition-colors cursor-pointer flex items-center justify-center"
            title={showNew ? t("hidePassword") : t("showPassword")}
          >
            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
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
          <Button
            variant="unstyled"
            type="button"
            onClick={onToggleShowConfirm}
            disabled={isPending}
            className="absolute right-3 p-1 text-secondary-text/60 hover:text-secondary-text rounded-full transition-colors cursor-pointer flex items-center justify-center"
            title={showConfirm ? t("hidePassword") : t("showPassword")}
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
        {errors.confirmNewPassword && (
          <p className="text-xs text-expense mt-0.5">
            {errors.confirmNewPassword.message}
          </p>
        )}
      </div>
    </ModalForm>
  );
}
