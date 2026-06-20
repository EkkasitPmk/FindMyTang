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
      <div className="bg-surface-secondary border border-border/60 rounded-md p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-md bg-primary-light/50 border border-primary-light flex items-center justify-center">
          <User className="w-6 h-6 text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-primary-text">
            John Doe
          </h4>
          <p className="text-xs text-secondary-text/80">
            guest@pocketnote.me (Guest Mode)
          </p>
        </div>
      </div>

      {/* Sync & Backup Main CTA */}
      <div className="bg-surface border border-border/60 rounded-md p-4 space-y-3">
        <div className="flex gap-3">
          <div className="p-2 rounded-md bg-primary-light/50 text-primary self-start">
            <Shield className="w-4 h-4" strokeWidth={1.5} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-primary-text">
              Cloud Backup & Sync
            </h5>
            <p className="text-[10px] text-secondary-text/85 mt-0.5">
              Connect an account to backup your transactions and sync across
              multiple devices.
            </p>
          </div>
        </div>
        <Link
          href="/login"
          onClick={onClose}
          className="w-full py-2 px-3 rounded-md bg-primary hover:bg-primary-hover text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors active-press shadow-sm"
        >
          <Lock className="w-3.5 h-3.5" strokeWidth={2} />
          Connect & Sync Account
        </Link>
      </div>

      {/* Preferences Section */}
      <div className="space-y-2">
        <h5 className="text-[11px] font-semibold text-secondary-text/85 uppercase tracking-wider px-1">
          Preferences
        </h5>
        <div className="bg-surface border border-border/60 rounded-md divide-y divide-border">
          {/* Language Selection */}
          <div className="flex justify-between items-center p-3">
            <div className="flex items-center gap-2.5">
              <Settings
                className="w-4 h-4 text-secondary-text"
                strokeWidth={1.5}
              />
              <span className="text-xs font-semibold text-primary-text">
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
                      ? "bg-primary-text text-surface"
                      : "bg-surface-secondary text-secondary-text hover:text-primary-text"
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
        <h5 className="text-[11px] font-semibold text-secondary-text/85 uppercase tracking-wider px-1">
          Management
        </h5>
        <div className="bg-surface border border-border/60 rounded-md divide-y divide-border">
          <Link
            href="/categories"
            onClick={onClose}
            className="w-full flex justify-between items-center p-3 hover:bg-surface-secondary/50 transition-colors text-left outline-none cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Tag
                className="w-4 h-4 text-secondary-text"
                strokeWidth={1.5}
              />
              <span className="text-xs font-semibold text-primary-text">
                Manage Categories
              </span>
            </div>
            <ChevronRight
              className="w-3.5 h-3.5 text-secondary-text/70"
              strokeWidth={1.5}
            />
          </Link>
          <Link
            href="/assets"
            onClick={onClose}
            className="w-full flex justify-between items-center p-3 hover:bg-surface-secondary/50 transition-colors text-left outline-none cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Wallet
                className="w-4 h-4 text-secondary-text"
                strokeWidth={1.5}
              />
              <span className="text-xs font-semibold text-primary-text">
                Manage Assets
              </span>
            </div>
            <ChevronRight
              className="w-3.5 h-3.5 text-secondary-text/70"
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="space-y-2">
        <h5 className="text-[11px] font-semibold text-secondary-text/85 uppercase tracking-wider px-1">
          Data Management
        </h5>
        <div className="bg-surface border border-border/60 rounded-md divide-y divide-border">
          <button
            onClick={handleExportData}
            className="w-full flex justify-between items-center p-3 hover:bg-surface-secondary/50 transition-colors text-left outline-none cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Download
                className="w-4 h-4 text-secondary-text"
                strokeWidth={1.5}
              />
              <span className="text-xs font-semibold text-primary-text">
                Export Data (JSON)
              </span>
            </div>
            <ChevronRight
              className="w-3.5 h-3.5 text-secondary-text/70"
              strokeWidth={1.5}
            />
          </button>

          <button
            onClick={handleResetData}
            className="w-full flex justify-between items-center p-3 hover:bg-expense-light/50 transition-colors text-left outline-none cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 text-secondary-text group-hover:text-expense">
              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-xs font-semibold text-primary-text group-hover:text-expense">
                Reset Local Data
              </span>
            </div>
            <ChevronRight
              className="w-3.5 h-3.5 text-secondary-text/70 group-hover:text-expense"
              strokeWidth={1.5}
            />
          </button>
        </div>
      </div>

      {/* App details & Help */}
      <div className="bg-surface-secondary border border-border/60 rounded-md p-3 flex justify-between items-center text-[10px] text-secondary-text/85">
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
