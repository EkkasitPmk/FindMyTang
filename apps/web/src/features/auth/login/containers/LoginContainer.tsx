"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Landmark, Eye, EyeOff, User } from "lucide-react";

export default function LoginContainer() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    router.push("/home");
  };

  return (
    <main className="min-h-screen flex flex-col justify-center px-container-padding py-stack-gap-lg">
      <div className="w-full max-w-sm mx-auto animate-subtle-pop">
        {/* Brand Logo Section */}
        <div className="mb-stack-gap-lg text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 select-none">
            <Landmark className="text-white w-7 h-7" strokeWidth={2} />
          </div>
          <div className="flex items-baseline gap-1 select-none">
            <span className="text-2xl font-bold tracking-tighter text-on-surface">
              PocketNote
            </span>
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          </div>
        </div>

        {/* Header Section */}
        <div className="mb-stack-gap-lg text-center select-none">
          <h1 className="font-title-md text-title-md text-on-surface mb-base">
            Welcome Back
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Log in to your Financial Command Center
          </p>
        </div>

        {/* Login Form */}
        <form
          className="flex flex-col gap-stack-gap-md"
          onSubmit={handleSubmit}
        >
          {/* Email Field */}
          <div className="flex flex-col gap-base">
            <input
              className="w-full h-14 px-4 bg-surface-container-low border border-transparent rounded-lg font-body-lg text-on-surface placeholder:text-on-surface-variant/60 transition-all focus:border-primary/20 outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Email address"
              type="email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-base">
            <div className="relative">
              <input
                className="w-full h-14 pl-4 pr-12 bg-surface-container-low border border-transparent rounded-lg font-body-lg text-on-surface placeholder:text-on-surface-variant/60 transition-all focus:border-primary/20 outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                required
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="flex justify-end mt-base">
              <Link
                className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors"
                href="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            className="w-full h-14 mt-stack-gap-sm bg-primary-container text-on-primary font-semibold text-base rounded-lg flex items-center justify-center active:scale-[0.98] transition-transform hover:opacity-90 cursor-pointer"
            type="submit"
          >
            Log In
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-stack-gap-lg flex items-center select-none">
          <div className="grow border-t border-outline-variant" />
          <span className="px-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            or
          </span>
          <div className="grow border-t border-outline-variant" />
        </div>

        {/* Social Authentication & Guest Mode */}
        <div className="flex flex-col gap-stack-gap-md">
          <button
            className="w-full h-14 border border-outline-variant bg-surface-container-lowest text-on-surface font-medium rounded-lg flex items-center justify-center gap-stack-gap-sm active:scale-[0.98] transition-transform hover:bg-surface-container-low cursor-pointer"
            type="button"
            onClick={() => router.push("/home")}
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
            className="w-full h-14 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold rounded-lg flex items-center justify-center gap-stack-gap-sm active:scale-[0.98] transition-transform cursor-pointer"
            type="button"
            onClick={() => router.push("/home")}
          >
            <User className="w-5 h-5 text-on-surface-variant" strokeWidth={2} />
            Continue as Guest
          </button>
        </div>

        {/* Footer Link */}
        <div className="mt-stack-gap-md text-center select-none">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
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
    </main>
  );
}
