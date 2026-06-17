"use client";
import { useState } from "react";
import Link from "next/link";
import {
  User,
  Shield,
  Globe,
  HelpCircle,
  ChevronRight,
  Settings,
  Download,
  Trash2,
  Lock,
  Tag,
  Wallet,
} from "lucide-react";

interface MoreContainerProps {
  onClose?: () => void;
}

export default function MoreContainer({
  onClose,
}: Readonly<MoreContainerProps>) {
  const [currency, setCurrency] = useState("THB");
  const [language, setLanguage] = useState("English");

  const handleExportData = () => {
    alert(
      "Exporting your local financial records to pocketnote_backup.json...",
    );
  };

  const handleResetData = () => {
    if (
      confirm(
        "Are you sure you want to reset all local data? This action cannot be undone.",
      )
    ) {
      alert("Local data cleared.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-lg mx-auto">
      {/* Profile Header (For mobile/desktop settings representation) */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-md p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-md bg-primary-container/8 border border-primary-container/10 flex items-center justify-center">
          <User className="w-6 h-6 text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <h4 className="font-title-md text-sm font-bold text-on-surface">
            John Doe
          </h4>
          <p className="text-xs text-on-surface-variant/80">
            guest@pocketnote.me (Guest Mode)
          </p>
        </div>
      </div>

      {/* Sync & Backup Main CTA */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-md p-4 space-y-3">
        <div className="flex gap-3">
          <div className="p-2 rounded-md bg-primary-container/8 text-primary self-start">
            <Shield className="w-4 h-4" strokeWidth={1.5} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-on-surface">
              Cloud Backup & Sync
            </h5>
            <p className="text-[10px] text-on-surface-variant/85 mt-0.5">
              Connect an account to backup your transactions and sync across
              multiple devices.
            </p>
          </div>
        </div>
        <Link
          href="/login"
          onClick={onClose}
          className="w-full py-2 px-3 rounded-md bg-primary-container hover:bg-primary text-on-primary font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors active-press shadow-sm"
        >
          <Lock className="w-3.5 h-3.5" strokeWidth={2} />
          Connect & Sync Account
        </Link>
      </div>

      {/* Preferences Section */}
      <div className="space-y-2">
        <h5 className="font-label-caps text-on-surface-variant/80 px-1">
          Preferences
        </h5>
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-md divide-y divide-outline-variant/50">
          {/* Currency selection */}
          <div className="flex justify-between items-center p-3">
            <div className="flex items-center gap-2.5">
              <Globe
                className="w-4 h-4 text-on-surface-variant"
                strokeWidth={1.5}
              />
              <span className="text-xs font-semibold text-on-surface">
                Base Currency
              </span>
            </div>
            <div className="flex gap-1">
              {["THB", "USD"].map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`py-1 px-2.5 rounded-md text-[10px] font-bold transition-all active-press ${
                    currency === curr
                      ? "bg-on-surface text-surface-container-lowest"
                      : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="flex justify-between items-center p-3">
            <div className="flex items-center gap-2.5">
              <Settings
                className="w-4 h-4 text-on-surface-variant"
                strokeWidth={1.5}
              />
              <span className="text-xs font-semibold text-on-surface">
                Language
              </span>
            </div>
            <div className="flex gap-1">
              {["English", "ไทย"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`py-1 px-2.5 rounded-md text-[10px] font-bold transition-all active-press ${
                    language === lang
                      ? "bg-on-surface text-surface-container-lowest"
                      : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Management Section */}
      <div className="space-y-2">
        <h5 className="font-label-caps text-on-surface-variant/80 px-1">
          Management
        </h5>
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-md divide-y divide-outline-variant/50">
          <Link
            href="/categories"
            onClick={onClose}
            className="w-full flex justify-between items-center p-3 hover:bg-surface-container-low/20 transition-colors text-left outline-none cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Tag
                className="w-4 h-4 text-on-surface-variant"
                strokeWidth={1.5}
              />
              <span className="text-xs font-semibold text-on-surface">
                Manage Categories
              </span>
            </div>
            <ChevronRight
              className="w-3.5 h-3.5 text-on-surface-variant/70"
              strokeWidth={1.5}
            />
          </Link>
          <Link
            href="/assets"
            onClick={onClose}
            className="w-full flex justify-between items-center p-3 hover:bg-surface-container-low/20 transition-colors text-left outline-none cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Wallet
                className="w-4 h-4 text-on-surface-variant"
                strokeWidth={1.5}
              />
              <span className="text-xs font-semibold text-on-surface">
                Manage Assets
              </span>
            </div>
            <ChevronRight
              className="w-3.5 h-3.5 text-on-surface-variant/70"
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="space-y-2">
        <h5 className="font-label-caps text-on-surface-variant/80 px-1">
          Data Management
        </h5>
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-md divide-y divide-outline-variant/50">
          <button
            onClick={handleExportData}
            className="w-full flex justify-between items-center p-3 hover:bg-surface-container-low/20 transition-colors text-left outline-none cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Download
                className="w-4 h-4 text-on-surface-variant"
                strokeWidth={1.5}
              />
              <span className="text-xs font-semibold text-on-surface">
                Export Data (JSON)
              </span>
            </div>
            <ChevronRight
              className="w-3.5 h-3.5 text-on-surface-variant/70"
              strokeWidth={1.5}
            />
          </button>

          <button
            onClick={handleResetData}
            className="w-full flex justify-between items-center p-3 hover:bg-error-container/5 transition-colors text-left outline-none cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 text-on-surface-variant group-hover:text-error">
              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-xs font-semibold text-on-surface group-hover:text-error">
                Reset Local Data
              </span>
            </div>
            <ChevronRight
              className="w-3.5 h-3.5 text-on-surface-variant/70 group-hover:text-error"
              strokeWidth={1.5}
            />
          </button>
        </div>
      </div>

      {/* App details & Help */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-md p-3 flex justify-between items-center text-[10px] text-on-surface-variant/85">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Version 1.0.0 (Geist Edition)</span>
        </div>
        <a href="#" className="hover:underline font-semibold text-primary">
          TOS & Privacy
        </a>
      </div>
    </div>
  );
}
