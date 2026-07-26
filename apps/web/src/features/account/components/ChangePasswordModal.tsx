import { Loader2, Eye, EyeOff } from "lucide-react";
import {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrors,
} from "react-hook-form";
import { ChangePasswordFormValues } from "../schemas/account.form.schema";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { Input } from "@/shared/components/customs/Input";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/shared/components/animate-ui/components/radix/sheet";

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
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="bottom"
        className="h-auto max-h-[80vh] rounded-t-2xl sm:max-w-lg sm:mx-auto border-border bg-surface p-4 shadow-2xl overflow-y-auto custom-scrollbar flex flex-col gap-2"
      >
        <SheetHeader className="text-left pb-1 px-0">
          <SheetTitle className="text-xl font-bold text-foreground">
            {t("changePassword")}
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 flex-1 flex flex-col min-h-0"
        >
          <div className="space-y-4 overflow-y-auto custom-scrollbar px-1">
            {/* Current Password */}
            <div className="space-y-1">
              <label
                htmlFor="currentPassword"
                className="text-xs text-secondary-text font-semibold tracking-wider block"
              >
                {t("currentPasswordLabel")}
              </label>
              <div className="relative flex items-center">
                <Input
                  id="currentPassword"
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

            {/* New Password */}
            <div className="space-y-1">
              <label
                htmlFor="newPassword"
                className="text-xs text-secondary-text font-semibold tracking-wider block"
              >
                {t("newPasswordLabel")}
              </label>
              <div className="relative flex items-center">
                <Input
                  id="newPassword"
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

            {/* Confirm New Password */}
            <div className="space-y-1">
              <label
                htmlFor="confirmNewPassword"
                className="text-xs text-secondary-text font-semibold tracking-wider block"
              >
                {t("confirmNewPasswordLabel")}
              </label>
              <div className="relative flex items-center">
                <Input
                  id="confirmNewPassword"
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
          </div>

          <SheetFooter className="px-4 py-2 flex-row gap-3">
            <SheetClose asChild>
              <Button
                variant="unstyled"
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="w-full border border-border rounded-lg py-2.5 text-sm font-medium hover:bg-surface-secondary transition-colors cursor-pointer text-secondary-text bg-surface shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("cancelBtn")}
              </Button>
            </SheetClose>
            <Button
              variant="unstyled"
              type="submit"
              disabled={isPending}
              className="w-full bg-primary hover:bg-primary-dark text-white rounded-lg py-2.5 text-sm font-medium transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {t("saveChanges")}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
