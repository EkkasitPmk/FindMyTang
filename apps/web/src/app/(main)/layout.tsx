"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Wallet,
  BookOpen,
  BarChart3,
  MoreHorizontal as More,
  X,
  User,
  Plus,
  LogIn,
} from "lucide-react";

const navItems = [
  { href: "/home", label: "Dashboard", icon: Home },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/transaction", label: "Transactions", icon: Plus },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/more", label: "More", icon: More },
];

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans">
      {/* Subtle brand color glow - very light opacity, surgical accent */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-primary-container/2 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] rounded-full bg-tertiary-container/1 blur-[120px] pointer-events-none" />

      {/* Main Shell Container */}
      <div className="flex flex-1 relative z-10">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r border-outline-variant/65 bg-surface-container-lowest sticky top-0 h-screen p-6 justify-between shrink-0">
          <div className="space-y-8">
            {/* Brand Title */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shadow-sm">
                <Wallet className="w-4 h-4 text-on-primary" strokeWidth={1.5} />
              </div>
              <span className="text-lg font-bold tracking-tight text-on-surface">
                PocketNote
              </span>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 active-press ${
                      isActive
                        ? "bg-primary-container/8 text-primary border border-primary-container/10"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low border border-transparent"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 transition-transform ${isActive ? "text-primary" : "text-on-surface-variant"}`}
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User profile & Action */}
          <div className="space-y-4 pt-6 border-t border-outline-variant/65">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-md bg-surface-container-low border border-outline-variant/50 flex items-center justify-center overflow-hidden">
                <User
                  className="w-5 h-5 text-on-surface-variant"
                  strokeWidth={1.5}
                />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-on-surface truncate">
                  John Doe (Guest)
                </p>
                <p className="text-[10px] text-on-surface-variant/80 truncate">
                  guest@pocketnote.me
                </p>
              </div>
            </div>
            <Link
              href="/login"
              className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-on-surface-variant hover:text-primary hover:bg-primary-container/10 transition-all duration-200 border border-transparent active-press"
            >
              <LogIn className="w-4 h-4" strokeWidth={1.5} />
              Sync & Backup
            </Link>
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Child Content */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-6xl w-full mx-auto pb-24 md:pb-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Drawer Navigation overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-on-surface/10 backdrop-blur-xs transition-opacity duration-300">
          <div className="w-64 bg-surface-container-lowest border-r border-outline-variant/65 p-6 flex flex-col justify-between animate-in slide-in-from-left duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
                    <Wallet
                      className="w-4 h-4 text-on-primary"
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="text-md font-bold text-on-surface">
                    PocketNote
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-md hover:bg-surface-container-low text-on-surface-variant"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-all active-press ${
                        isActive
                          ? "bg-primary-container/8 text-primary border border-primary-container/10"
                          : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low border border-transparent"
                      }`}
                    >
                      <Icon
                        className="w-4 h-4"
                        strokeWidth={isActive ? 2 : 1.5}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-2 pt-4 border-t border-outline-variant/65">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-md bg-surface-container-low flex items-center justify-center">
                  <User
                    className="w-5 h-5 text-on-surface-variant"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-surface">
                    John Doe
                  </p>
                  <p className="text-[10px] text-on-surface-variant/80">
                    guest@pocketnote.me
                  </p>
                </div>
              </div>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-on-surface-variant hover:text-primary hover:bg-primary-container/10 transition-all active-press"
              >
                <LogIn className="w-4 h-4" strokeWidth={1.5} />
                Sync & Backup
              </Link>
            </div>
          </div>

          {/* Transparent dismiss area */}
          <button
            className="flex-1 cursor-default outline-hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          />
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface/90 backdrop-blur-md border-t border-outline-variant/65 flex justify-around items-center py-2 px-4 shadow-sm">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          if (item.href === "/more") {
            const isMoreActive = pathname.startsWith("/more") || mobileMenuOpen;
            return (
              <button
                key={item.href}
                onClick={() => setMobileMenuOpen(true)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-md text-[10px] font-semibold transition-all active-press cursor-pointer outline-none ${
                  isMoreActive
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <div className="h-6 flex items-center justify-center">
                  <Icon
                    className="w-5 h-5"
                    strokeWidth={isMoreActive ? 2 : 1.5}
                  />
                </div>
                {item.label}
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-md text-[10px] font-semibold transition-all active-press ${
                isActive
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <div className="h-6 flex items-center justify-center">
                <Icon
                  className={
                    item.href === "/transaction" ? "w-6 h-6" : "w-5 h-5"
                  }
                  strokeWidth={isActive ? 2 : 1.5}
                />
              </div>
              {item.label.split(" ")[0]} {/* Shorten for mobile layout */}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
