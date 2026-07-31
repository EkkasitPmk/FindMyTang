import { Eye, EyeOff, User, Wallet } from "lucide-react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import { LoginFormValues } from "../schemas/login.form.schema";
import { Input } from "@/shared/components/customs/Input";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { TranslationKey } from "@/shared/lib/configs/translations.config";

interface LoginFormProps {
  register: UseFormRegister<LoginFormValues>;
  handleSubmit: UseFormHandleSubmit<LoginFormValues>;
  onSubmit: (values: LoginFormValues) => void;
  errors: FieldErrors<LoginFormValues>;
  isPending: boolean;
  onGuestLogin: () => void;
  onSignUpClick: () => void;
  showPassword: boolean;
  onToggleShowPassword: () => void;
}

export default function LoginForm({
  register,
  handleSubmit,
  onSubmit,
  errors,
  isPending,
  onGuestLogin,
  onSignUpClick,
  showPassword,
  onToggleShowPassword,
}: Readonly<LoginFormProps>) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col justify-center bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm mx-auto bg-surface p-8 sm:p-10 border border-border/60 rounded-2xl shadow-sm animate-subtle-pop space-y-6">
        {/* Brand Logo Section */}
        <div className="text-center flex flex-col items-center space-y-2 mb-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center select-none shadow-sm">
            <Wallet className="text-white w-6 h-6" strokeWidth={2} />
          </div>
          <div className="flex items-baseline gap-1 select-none">
            <span className="text-2xl font-bold tracking-tighter text-primary-text">
              FindMyTang
            </span>
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center select-none">
          <h1 className="text-xl sm:text-2xl text-primary-text font-bold tracking-tight">
            {t("loginWelcome")}
          </h1>
          <p className="text-sm text-secondary-text">{t("loginSubtitle")}</p>
        </div>

        {/* Login Form */}
        <form
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <Input
              className="bg-surface-secondary"
              placeholder={t("emailPlaceholder")}
              type="email"
              error={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-expense font-medium">
                {t(errors.email.message as TranslationKey)}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <div className="relative">
              <Input
                className="pr-12 bg-surface-secondary"
                placeholder={t("passwordPlaceholder")}
                type={showPassword ? "text" : "password"}
                error={!!errors.password}
                {...register("password")}
              />
              <Button
                variant="unstyled"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-text hover:text-primary transition-colors cursor-pointer flex items-center justify-center"
                type="button"
                onClick={onToggleShowPassword}
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
            {/* Forgot password link hidden temporarily */}
            {/* <div className="flex justify-end pt-0.5">
              <Link
                className="text-xs text-secondary-text hover:text-primary transition-colors"
                href="/forgot-password"
              >
                {t("forgotPassword")}
              </Link>
            </div> */}
          </div>

          {/* Primary Action Button */}
          <Button
            variant="unstyled"
            className="w-full h-12 bg-primary text-white font-semibold text-base rounded-lg flex items-center justify-center transition-all hover:bg-primary-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isPending}
          >
            {isPending ? t("loggingIn") : t("signInBtn")}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center select-none py-1">
          <div className="grow border-t border-border/80" />
          <span className="px-4 text-xs font-semibold text-secondary-text uppercase tracking-widest">
            {t("or")}
          </span>
          <div className="grow border-t border-border/80" />
        </div>

        {/* Social Authentication & Guest Mode */}
        <div className="flex flex-col space-y-3">
          {/* Continue with Google button hidden temporarily */}
          {/* <Button
            variant="unstyled"
            className="w-full h-12 border border-border bg-surface text-primary-text font-medium rounded-lg flex items-center justify-center gap-2.5 transition-all hover:bg-surface-secondary cursor-pointer"
            type="button"
            onClick={onGoogleLogin}
          >
            ...
          </Button> */}

          <Button
            variant="unstyled"
            className="w-full h-12 bg-surface-secondary hover:bg-border/40 text-primary-text font-semibold rounded-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            type="button"
            onClick={onGuestLogin}
          >
            <User className="w-5 h-5 text-secondary-text" strokeWidth={2} />
            {t("continueAsGuest")}
          </Button>
        </div>

        {/* Footer Link */}
        <div className="text-center select-none">
          <p className="text-sm text-secondary-text">
            {t("noAccount")}{" "}
            <button
              type="button"
              className="text-primary font-semibold hover:underline cursor-pointer"
              onClick={onSignUpClick}
            >
              {t("signUpHere")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
