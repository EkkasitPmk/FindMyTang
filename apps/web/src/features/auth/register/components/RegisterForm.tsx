import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import { RegisterFormValues } from "../schemas/register.schema";

interface RegisterFormProps {
  register: UseFormRegister<RegisterFormValues>;
  handleSubmit: UseFormHandleSubmit<RegisterFormValues>;
  onSubmit: (values: RegisterFormValues) => void;
  errors: FieldErrors<RegisterFormValues>;
  isPending: boolean;
  globalError: string | null;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onToggleShowPassword: () => void;
  onToggleShowConfirmPassword: () => void;
}

export default function RegisterForm({
  register,
  handleSubmit,
  onSubmit,
  errors,
  isPending,
  globalError,
  showPassword,
  showConfirmPassword,
  onToggleShowPassword,
  onToggleShowConfirmPassword,
}: Readonly<RegisterFormProps>) {

  return (
    <div className="min-h-screen flex flex-col justify-center bg-background py-8 px-4 sm:px-6 lg:px-8">
      {/* Main Registration Content */}
      <div className="w-full max-w-sm mx-auto bg-surface p-8 sm:p-10 border border-border/60 rounded-2xl shadow-sm animate-subtle-pop space-y-6">
        {/* Header Section */}
        <div className="text-center select-none">
          <h1 className="text-xl sm:text-2xl text-primary-text font-bold tracking-tight">
            Create Account
          </h1>
          <p className="text-sm text-secondary-text">
            Start tracking your financial journey
          </p>
        </div>

        {/* Global Error Banner */}
        {globalError && (
          <div className="p-3 bg-expense-light text-expense border border-expense/20 rounded-lg text-sm">
            {globalError}
          </div>
        )}

        {/* Form Section */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Display Name */}
          <div className="flex flex-col gap-1.5">
            <input
              type="text"
              placeholder="Display Name"
              {...register("displayName")}
              className="w-full h-12 px-4 bg-surface-secondary border border-border/50 rounded-lg text-primary-text placeholder:text-secondary-text/60 focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
            />
            {errors.displayName && (
              <p className="text-xs text-expense font-medium">
                {errors.displayName.message}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <input
              type="email"
              placeholder="Email address"
              {...register("email")}
              className="w-full h-12 px-4 bg-surface-secondary border border-border/50 rounded-lg text-primary-text placeholder:text-secondary-text/60 focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
            />
            {errors.email && (
              <p className="text-xs text-expense font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                className="w-full h-12 pl-4 pr-12 bg-surface-secondary border border-border/50 rounded-lg text-primary-text placeholder:text-secondary-text/60 focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
              />
              <button
                type="button"
                onClick={onToggleShowPassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-text hover:text-primary transition-colors outline-none cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-expense font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                className="w-full h-12 pl-4 pr-12 bg-surface-secondary border border-border/50 rounded-lg text-primary-text placeholder:text-secondary-text/60 focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
              />
              <button
                type="button"
                onClick={onToggleShowConfirmPassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-text hover:text-primary transition-colors outline-none cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-expense font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Legal Checkbox */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-start gap-3 py-1">
              <input
                id="terms"
                type="checkbox"
                {...register("agreeToTerms")}
                className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary cursor-pointer transition-colors mt-0.5"
              />
              <label
                htmlFor="terms"
                className="text-sm text-secondary-text cursor-pointer select-none"
              >
                I agree to the{" "}
                <Link
                  href="#"
                  className="text-primary font-medium hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  className="text-primary font-medium hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-xs text-expense font-medium">
                {errors.agreeToTerms.message}
              </p>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-primary text-white text-base rounded-lg font-semibold hover:bg-primary-hover active:scale-[0.98] active-press transition-all shadow-sm flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center py-1 mb-3">
          <div className="grow border-t border-border/80"></div>
        </div>

        {/* Footer Section */}
        <footer className="w-full flex flex-col items-center z-10 pt-2 select-none">
          <p className="text-sm text-secondary-text">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </footer>
      </div>

      {/* Decorative Elements */}
      <div className="fixed bottom-0 right-0 w-64 h-64 opacity-10 pointer-events-none z-0 blur-3xl bg-primary-light rounded-full translate-x-1/2 translate-y-1/2"></div>
      <div className="fixed top-0 left-0 w-64 h-64 opacity-5 pointer-events-none z-0 blur-3xl bg-accent-light rounded-full -translate-x-1/2 -translate-y-1/2"></div>
    </div>
  );
}
