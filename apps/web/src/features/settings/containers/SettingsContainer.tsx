"use client";
import Link from "next/link";
import {
  User,
  Shield,
  Globe,
  HelpCircle,
  ChevronRight,
  Download,
  Trash2,
  Lock,
  Tag,
  Wallet,
} from "lucide-react";
import { useTranslation } from "@/shared/lib/i18n/useTranslation";
import { useIsGuest } from "@/shared/lib/store/guest-store";

interface SettingsContainerProps {
  onClose?: () => void;
}

export default function SettingsContainer({
  onClose,
}: Readonly<SettingsContainerProps>) {
  const { t, currentLanguage, changeLanguage } = useTranslation();
  const isGuest = useIsGuest();

  const handleExportData = () => {
    alert(t("exportAlert"));
  };

  const handleResetData = () => {
    if (confirm(t("resetConfirm"))) {
      alert(t("resetAlert"));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Profile Header */}
      <div className="space-y-2">
        <h5 className="text-[11px] font-semibold text-secondary-text/85 uppercase tracking-wider px-1">
          {t("personalInfo")}
        </h5>
        <Link
          href="/settings/account"
          onClick={onClose}
          className="block bg-surface border border-border/60 rounded-md hover:bg-surface-secondary/50 transition-colors cursor-pointer"
        >
          <div className="flex justify-between items-center p-3">
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-secondary-text" strokeWidth={1.5} />
              <span className="text-xs font-semibold text-primary-text">
                {t("account")}
              </span>
            </div>
            <ChevronRight
              className="w-3.5 h-3.5 text-secondary-text/70"
              strokeWidth={1.5}
            />
          </div>
        </Link>
      </div>

      {/* Sync & Backup Main CTA */}
      {isGuest && (
        <div className="bg-surface border border-border/60 rounded-md p-4 space-y-3">
          <div className="flex gap-3">
            <div className="p-2 rounded-md bg-primary-light/50 text-primary self-start">
              <Shield className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <h5 className="text-xs font-bold text-primary-text">
                {t("syncTitle")}
              </h5>
              <p className="text-[10px] text-secondary-text/85 mt-0.5">
                {t("syncDesc")}
              </p>
            </div>
          </div>
          <Link
            href="/login"
            onClick={onClose}
            className="w-full py-2 px-3 rounded-md bg-primary hover:bg-primary-hover text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors active-press shadow-sm"
          >
            <Lock className="w-3.5 h-3.5" strokeWidth={2} />
            {t("connectBtn")}
          </Link>
        </div>
      )}

      {/* Preferences Section */}
      <div className="space-y-2">
        <h5 className="text-[11px] font-semibold text-secondary-text/85 uppercase tracking-wider px-1">
          {t("preferences")}
        </h5>
        <div className="bg-surface border border-border/60 rounded-md divide-y divide-border">
          {/* Language Selection */}
          <div className="flex justify-between items-center p-3">
            <div className="flex items-center gap-2.5">
              <Globe
                className="w-4 h-4 text-secondary-text"
                strokeWidth={1.5}
              />
              <span className="text-xs font-semibold text-primary-text">
                {t("language")}
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => changeLanguage("en")}
                className={`py-1 px-2.5 rounded-md text-[10px] font-bold transition-all active-press cursor-pointer ${
                  currentLanguage === "en"
                    ? "bg-primary-text text-surface"
                    : "bg-surface-secondary text-secondary-text hover:text-primary-text"
                }`}
              >
                English
              </button>
              <button
                onClick={() => changeLanguage("th")}
                className={`py-1 px-2.5 rounded-md text-[10px] font-bold transition-all active-press cursor-pointer ${
                  currentLanguage === "th"
                    ? "bg-primary-text text-surface"
                    : "bg-surface-secondary text-secondary-text hover:text-primary-text"
                }`}
              >
                ไทย
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Management Section */}
      <div className="space-y-2">
        <h5 className="text-[11px] font-semibold text-secondary-text/85 uppercase tracking-wider px-1">
          {t("management")}
        </h5>
        <div className="bg-surface border border-border/60 rounded-md divide-y divide-border">
          <Link
            href="/categories"
            onClick={onClose}
            className="w-full flex justify-between items-center p-3 hover:bg-surface-secondary/50 transition-colors text-left outline-none cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Tag className="w-4 h-4 text-secondary-text" strokeWidth={1.5} />
              <span className="text-xs font-semibold text-primary-text">
                {t("manageCategories")}
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
                {t("manageAssets")}
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
          {t("dataManagement")}
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
                {t("exportData")}
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
                {t("resetData")}
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
