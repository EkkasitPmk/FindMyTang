"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterContainer() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  return (
    <main className="min-h-screen flex flex-col justify-center px-container-padding">
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

        {/* Form Section */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* Display Name */}
          <div>
            <input
              type="text"
              placeholder="Display Name"
              className="w-full h-14 px-4 bg-surface-container-low border-none rounded-lg font-body-lg text-on-surface placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary-container/20 outline-none transition-all duration-200"
            />
          </div>

          {/* Email Address */}
          <div>
            <input
              type="email"
              placeholder="Email address"
              className="w-full h-14 px-4 bg-surface-container-low border-none rounded-lg font-body-lg text-on-surface placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary-container/20 outline-none transition-all duration-200"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
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

          {/* Legal Checkbox */}
          <div className="flex items-start gap-3 py-2">
            <input
              id="terms"
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
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

          {/* Primary Action Button */}
          <button
            type="submit"
            className="w-full h-14 bg-primary-container text-on-primary text-base rounded-lg font-semibold hover:opacity-90 active:scale-[0.98] active-press transition-all mt-4 mb-6 shadow-sm flex items-center justify-center gap-2 group"
          >
            Create Account
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
    </main>
  );
}
