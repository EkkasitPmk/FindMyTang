import Link from "next/link";
import { Landmark, Eye, EyeOff, User } from "lucide-react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import { LoginFormValues } from "../schemas/login.schema";

interface LoginFormProps {
  register: UseFormRegister<LoginFormValues>;
  handleSubmit: UseFormHandleSubmit<LoginFormValues>;
  onSubmit: (values: LoginFormValues) => void;
  errors: FieldErrors<LoginFormValues>;
  isPending: boolean;
  globalError: string | null;
  onGoogleLogin: () => void;
  onGuestLogin: () => void;
  showPassword: boolean;
  onToggleShowPassword: () => void;
}

export default function LoginForm({
  register,
  handleSubmit,
  onSubmit,
  errors,
  isPending,
  globalError,
  onGoogleLogin,
  onGuestLogin,
  showPassword,
  onToggleShowPassword,
}: Readonly<LoginFormProps>) {

  return (
    <div className="min-h-screen flex flex-col justify-center bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm mx-auto bg-surface p-8 sm:p-10 border border-border/60 rounded-2xl shadow-sm animate-subtle-pop space-y-6">
        {/* Brand Logo Section */}
        <div className="text-center flex flex-col items-center space-y-2 mb-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center select-none shadow-sm active-press">
            <Landmark className="text-white w-6 h-6" strokeWidth={2} />
          </div>
          <div className="flex items-baseline gap-1 select-none">
            <span className="text-2xl font-bold tracking-tighter text-primary-text">
              PocketNote
            </span>
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center select-none">
          <h1 className="text-xl sm:text-2xl text-primary-text font-bold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-secondary-text">
            Log in to your Financial Command Center
          </p>
        </div>

        {/* Global Error Banner */}
        {globalError && (
          <div className="p-3 bg-expense-light text-expense border border-expense/20 rounded-lg text-sm">
            {globalError}
          </div>
        )}

        {/* Login Form */}
        <form
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <input
              className="w-full h-12 px-4 bg-surface-secondary border border-border/50 rounded-lg text-primary-text placeholder:text-secondary-text/60 transition-all focus:border-primary/50 outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Email address"
              type="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-expense font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <div className="relative">
              <input
                className="w-full h-12 pl-4 pr-12 bg-surface-secondary border border-border/50 rounded-lg text-primary-text placeholder:text-secondary-text/60 transition-all focus:border-primary/50 outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-text hover:text-primary transition-colors cursor-pointer flex items-center justify-center"
                type="button"
                onClick={onToggleShowPassword}
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
            <div className="flex justify-end pt-0.5">
              <Link
                className="text-xs text-secondary-text hover:text-primary transition-colors"
                href="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            className="w-full h-12 bg-primary text-white font-semibold text-base rounded-lg flex items-center justify-center active:scale-[0.98] transition-all hover:bg-primary-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Logging In..." : "Log In"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center select-none py-1">
          <div className="grow border-t border-border/80" />
          <span className="px-4 text-xs font-semibold text-secondary-text uppercase tracking-widest">
            or
          </span>
          <div className="grow border-t border-border/80" />
        </div>

        {/* Social Authentication & Guest Mode */}
        <div className="flex flex-col space-y-3">
          <button
            className="w-full h-12 border border-border bg-surface text-primary-text font-medium rounded-lg flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all hover:bg-surface-secondary cursor-pointer"
            type="button"
            onClick={onGoogleLogin}
          >
            <svg
              fill="none"
              height="20"
              viewBox="0 0 24 24"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <button
            className="w-full h-12 bg-surface-secondary hover:bg-border/40 text-primary-text font-semibold rounded-lg flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all cursor-pointer"
            type="button"
            onClick={onGuestLogin}
          >
            <User className="w-5 h-5 text-secondary-text" strokeWidth={2} />
            Continue as Guest
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center select-none">
          <p className="text-sm text-secondary-text">
            {"Don't have an account? "}
            <Link
              className="text-primary font-semibold hover:underline"
              href="/register"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
