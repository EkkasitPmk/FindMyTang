import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import {
  UseFormRegister,
  Control,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import { RegisterFormValues } from "../schemas/register.form.schema";
import { Input } from "@/shared/components/customs/Input";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { Checkbox } from "@/shared/components/animate-ui/components/radix/checkbox";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { TranslationKey } from "@/shared/lib/configs/translations.config";
import TermsOfServiceModal from "@/shared/components/customs/TermsOfServiceModal";
import PrivacyPolicyModal from "@/shared/components/customs/PrivacyPolicyModal";

interface RegisterFormProps {
  register: UseFormRegister<RegisterFormValues>;
  control: Control<RegisterFormValues>;
  handleSubmit: UseFormHandleSubmit<RegisterFormValues>;
  onSubmit: (values: RegisterFormValues) => void;
  errors: FieldErrors<RegisterFormValues>;
  isPending: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onToggleShowPassword: () => void;
  onToggleShowConfirmPassword: () => void;
}

export default function RegisterForm({
  register,
  control,
  handleSubmit,
  onSubmit,
  errors,
  isPending,
  showPassword,
  showConfirmPassword,
  onToggleShowPassword,
  onToggleShowConfirmPassword,
}: Readonly<RegisterFormProps>) {
  const { t } = useTranslation();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-center bg-background py-8 px-4 sm:px-6 lg:px-8">
      {/* Main Registration Content */}
      <div className="w-full max-w-sm mx-auto bg-surface p-8 sm:p-10 border border-border/60 rounded-2xl shadow-sm animate-subtle-pop space-y-6">
        {/* Header Section */}
        <div className="text-center select-none">
          <h1 className="text-xl sm:text-2xl text-primary-text font-bold tracking-tight">
            {t("registerTitle")}
          </h1>
          <p className="text-sm text-secondary-text">{t("registerSubtitle")}</p>
        </div>

        {/* Form Section */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Display Name */}
          <div className="flex flex-col gap-1.5">
            <Input
              type="text"
              placeholder={t("displayNamePlaceholder")}
              className="bg-surface-secondary"
              error={!!errors.displayName}
              {...register("displayName")}
            />
            {errors.displayName && (
              <p className="text-xs text-expense font-medium">
                {t(errors.displayName.message as TranslationKey)}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <Input
              type="email"
              placeholder={t("emailPlaceholder")}
              className="bg-surface-secondary"
              error={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-expense font-medium">
                {t(errors.email.message as TranslationKey)}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={t("passwordPlaceholder")}
                className="pr-12 bg-surface-secondary"
                error={!!errors.password}
                {...register("password")}
              />
              <Button
                variant="unstyled"
                type="button"
                onClick={onToggleShowPassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-text hover:text-primary transition-colors outline-none cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-xs text-expense font-medium">
                {t(errors.password.message as TranslationKey)}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("confirmPasswordPlaceholder")}
                className="pr-12 bg-surface-secondary"
                error={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              <Button
                variant="unstyled"
                type="button"
                onClick={onToggleShowConfirmPassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-text hover:text-primary transition-colors outline-none cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-expense font-medium">
                {t(errors.confirmPassword.message as TranslationKey)}
              </p>
            )}
          </div>

          {/* Legal Checkbox */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-start gap-3 py-1">
              <Controller
                name="agreeToTerms"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="terms"
                    size={"sm"}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5"
                  />
                )}
              />
              <label
                htmlFor="terms"
                className="text-sm text-secondary-text cursor-pointer select-none"
              >
                {t("agreeTo")}{" "}
                <Button
                  type="button"
                  variant="unstyled"
                  tapScale={1}
                  hoverScale={1}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsTermsOpen(true);
                  }}
                  className="text-primary font-medium hover:underline inline-block p-0 bg-transparent border-none cursor-pointer"
                >
                  {t("termsOfService")}
                </Button>{" "}
                {t("and")}{" "}
                <Button
                  type="button"
                  variant="unstyled"
                  tapScale={1}
                  hoverScale={1}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsPrivacyOpen(true);
                  }}
                  className="text-primary font-medium hover:underline inline-block p-0 bg-transparent border-none cursor-pointer"
                >
                  {t("privacyPolicy")}
                </Button>
                .
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-xs text-expense font-medium">
                {t(errors.agreeToTerms.message as TranslationKey)}
              </p>
            )}
          </div>

          {/* Primary Action Button */}
          <Button
            variant="unstyled"
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-primary text-white text-base rounded-lg font-semibold hover:bg-primary-hover transition-all shadow-sm flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? t("registering") : t("signUpBtn")}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center py-1 mb-3">
          <div className="grow border-t border-border/80"></div>
        </div>

        {/* Footer Section */}
        <footer className="w-full flex flex-col items-center z-10 pt-2 select-none">
          <p className="text-sm text-secondary-text">
            {t("alreadyHaveAccount")}{" "}
            <Link
              href="/login"
              className="text-primary font-bold hover:underline"
            >
              {t("signInHere")}
            </Link>
          </p>
        </footer>
      </div>

      {/* Legal Modals */}
      <TermsOfServiceModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}
