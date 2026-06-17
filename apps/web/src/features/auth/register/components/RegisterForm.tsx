import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import { RegisterFormValues } from "../schemas/register.schema";
import { useState } from "react";

interface RegisterFormProps {
  register: UseFormRegister<RegisterFormValues>;
  handleSubmit: UseFormHandleSubmit<RegisterFormValues>;
  onSubmit: (values: RegisterFormValues) => void;
  errors: FieldErrors<RegisterFormValues>;
  isPending: boolean;
  globalError: string | null;
}

export default function RegisterForm({
  register,
  handleSubmit,
  onSubmit,
  errors,
  isPending,
  globalError,
}: Readonly<RegisterFormProps>) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-center px-container-padding py-stack-gap-lg">
      {/* Main Registration Content */}
      <div className="w-full max-w-sm mx-auto animate-subtle-pop">
        {/* Header Section */}
        <div className="text-center mb-stack-gap-lg">
          <h1 className="font-headline-lg-mobile text-on-surface mb-2 font-bold">
            Create Account
          </h1>
          <p className="font-body-sm text-on-surface-variant">
            Start tracking your financial journey
          </p>
        </div>

        {/* Global Error Banner */}
        {globalError && (
          <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg font-body-sm">
            {globalError}
          </div>
        )}

        {/* Form Section */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Display Name */}
          <div>
            <input
              type="text"
              placeholder="Display Name"
              {...register("displayName")}
              className="w-full h-14 px-4 bg-surface-container-low border-none rounded-lg font-body-lg text-on-surface placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary-container/20 outline-none transition-all duration-200"
            />
            {errors.displayName && (
              <p className="mt-1 text-xs text-error font-medium">
                {errors.displayName.message}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <input
              type="email"
              placeholder="Email address"
              {...register("email")}
              className="w-full h-14 px-4 bg-surface-container-low border-none rounded-lg font-body-lg text-on-surface placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary-container/20 outline-none transition-all duration-200"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-error font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                className="w-full h-14 pl-4 pr-12 bg-surface-container-low border-none rounded-lg font-body-lg text-on-surface placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary-container/20 outline-none transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-error font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                className="w-full h-14 pl-4 pr-12 bg-surface-container-low border-none rounded-lg font-body-lg text-on-surface placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary-container/20 outline-none transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-error font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Legal Checkbox */}
          <div>
            <div className="flex items-start gap-3 py-2">
              <input
                id="terms"
                type="checkbox"
                {...register("agreeToTerms")}
                className="h-4.5 w-4.5 rounded border-outline-variant text-primary-container focus:ring-primary-container cursor-pointer transition-colors"
              />
              <label
                htmlFor="terms"
                className="font-body-sm text-on-surface-variant cursor-pointer select-none"
              >
                I agree to the{" "}
                <Link
                  href="#"
                  className="text-primary-container font-medium hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  className="text-primary-container font-medium hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="mt-1 text-xs text-error font-medium">
                {errors.agreeToTerms.message}
              </p>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-14 bg-primary-container text-on-primary text-base rounded-lg font-semibold hover:opacity-90 active:scale-[0.98] active-press transition-all mt-4 mb-6 shadow-sm flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-stack-gap-md flex items-center">
          <div className="grow border-t border-outline-variant/30"></div>
        </div>

        {/* Footer Section */}
        <footer className="w-full py-stack-gap-sm flex flex-col items-center gap-stack-gap-sm px-container-padding z-10">
          <p className="font-body-sm text-on-surface-variant">
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
      <div className="fixed bottom-0 right-0 w-64 h-64 opacity-10 pointer-events-none z-0 blur-3xl bg-primary-container rounded-full translate-x-1/2 translate-y-1/2"></div>
      <div className="fixed top-0 left-0 w-64 h-64 opacity-5 pointer-events-none z-0 blur-3xl bg-secondary-container rounded-full -translate-x-1/2 -translate-y-1/2"></div>
    </div>
  );
}
