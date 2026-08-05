"use client";
import { useState } from "react";
import Link from "next/link";
import {
  User,
  Globe,
  Tag,
  Wallet,
  HelpCircle,
  MessageSquareText,
  Lightbulb,
  ChevronRight,
  Moon,
} from "lucide-react";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import TermsOfServiceModal from "@/shared/components/customs/TermsOfServiceModal";
import PrivacyPolicyModal from "@/shared/components/customs/PrivacyPolicyModal";
import { useIsGuest } from "@/shared/lib/storages/guest.storage";
import { useFeatureLockModal } from "@/shared/lib/hooks/useFeatureLockModal.hook";
import { APP_VERSION } from "@/shared/lib/configs/app.config";
import SettingsMenuItem from "../components/SettingsMenuItem";
import SettingsSection from "../components/SettingsSection";
import ThemeSwitcher from "@/shared/components/customs/ThemeSwitcher";
import CategoryContainer from "@/features/category/containers/CategoryContainer";
import AccountContainer from "@/features/account/containers/AccountContainer";
import ManageAssetsContainer from "@/features/assets/containers/ManageAssetsContainer";
import { cn } from "@/shared/lib/utils/core.util";

interface SettingsContainerProps {
  onClose?: () => void;
}

export default function SettingsContainer({
  onClose,
}: Readonly<SettingsContainerProps>) {
  const { t, currentLanguage, changeLanguage } = useTranslation();
  const isGuest = useIsGuest();
  const openLockModal = useFeatureLockModal((state) => state.openModal);

  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <>
      {/* desktop ui */}
      <div className={cn("hidden md:block", "animate-in fade-in duration-300")}>
        <div
          className={cn(
            "grid gap-4 lg:gap-6",
            "md:grid-cols-1 md:grid-rows-[auto_auto_auto]",
            "lg:grid-cols-[minmax(0,1fr)_400px] lg:grid-rows-[auto_auto] xl:grid-cols-[minmax(0,1fr)_500px] 2xl:grid-cols-[minmax(0,1fr)_700px]",
          )}
        >
          <div
            className={cn(
              "contents",
              "lg:col-start-1 lg:row-start-1 lg:row-span-2",
              "lg:grid lg:grid-rows-[auto_auto] lg:content-start lg:gap-6",
            )}
          >
            <div
              className={cn(
                "bg-surface rounded-md border border-border",
                "md:col-start-1 md:row-start-1",
                "lg:row-start-1",
                "xl:h-fit xl:self-start",
              )}
            >
              <AccountContainer />
            </div>
            <div
              className={cn(
                "bg-surface rounded-md border border-border",
                "md:col-start-1 md:row-start-3",
                "lg:row-start-2",
              )}
            >
              <ManageAssetsContainer />
            </div>
          </div>
          <div
            className={cn(
              "bg-surface rounded-md border border-border",
              "md:col-start-1 md:row-start-2",
              "lg:col-start-2 lg:row-start-1 lg:row-span-2",
              "lg:self-stretch",
            )}
          >
            <CategoryContainer />
          </div>
        </div>
      </div>
      {/* desktop ui */}

      {/* mobile ui */}
      <div className="md:hidden space-y-6 px-4 py-3 animate-in fade-in duration-300">
        <SettingsSection title={t("personalInfo")}>
          <Link
            href="/settings/account"
            onClick={(event) => {
              if (isGuest) {
                event.preventDefault();
                openLockModal(t("accountSettingsBackup"));
                return;
              }
              onClose?.();
            }}
            className="block bg-surface border border-border rounded-xl hover:bg-surface-secondary transition-colors cursor-pointer shadow-xs"
          >
            <div className="flex justify-between items-center py-2 p-3.5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-info-light text-info">
                  <User className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-semibold text-primary-text">
                  {t("account")}
                </span>
              </div>
              <ChevronRight
                className="w-4 h-4 text-secondary-text/70"
                strokeWidth={1.5}
              />
            </div>
          </Link>
        </SettingsSection>

        <SettingsSection title={t("preferences")}>
          <div className="bg-surface border border-border rounded-xl divide-y divide-border shadow-xs">
            {/* Language Selection */}
            <div className="flex justify-between items-center py-2 p-3.5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-transfer/20 text-transfer">
                  <Globe className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-semibold text-primary-text">
                  {t("language")}
                </span>
              </div>
              <div className="flex gap-1 bg-surface-secondary p-1 rounded-lg border border-border/50">
                <Button
                  variant="unstyled"
                  onClick={() => changeLanguage("en")}
                  className={`py-1 px-3 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    currentLanguage === "en"
                      ? "bg-primary text-white shadow-xs"
                      : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  English
                </Button>
                <Button
                  variant="unstyled"
                  onClick={() => changeLanguage("th")}
                  className={`py-1 px-3 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    currentLanguage === "th"
                      ? "bg-primary text-white shadow-xs"
                      : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  ไทย
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center gap-3 py-2 p-3.5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-light text-primary">
                  <Moon className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-semibold text-primary-text">
                  {t("themeMode")}
                </span>
              </div>
              <ThemeSwitcher />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title={t("management")}>
          <div className="bg-surface border border-border rounded-xl divide-y divide-border shadow-xs">
            <SettingsMenuItem
              href="/categories"
              label={t("manageCategories")}
              icon={Tag}
              iconClassName="text-highlight"
              iconBackgroundClassName="bg-highlight-light"
              onClick={onClose}
            />
            <SettingsMenuItem
              href="/assets"
              label={t("manageAssets")}
              icon={Wallet}
              iconClassName="text-income"
              iconBackgroundClassName="bg-income-light"
              onClick={onClose}
            />
          </div>
        </SettingsSection>

        <SettingsSection title={t("helpAndFeedback")}>
          <div className="bg-surface border border-border rounded-xl divide-y divide-border shadow-xs">
            <SettingsMenuItem
              href="/support/feedback"
              label={t("sendFeedback")}
              icon={Lightbulb}
              iconClassName="text-investment"
              iconBackgroundClassName="bg-investment-light"
              onClick={onClose}
            />
            <SettingsMenuItem
              href="/support/contact"
              label={t("contactUs")}
              icon={MessageSquareText}
              iconClassName="text-primary"
              iconBackgroundClassName="bg-primary-light"
              onClick={onClose}
            />
          </div>
        </SettingsSection>

        {/* App Version & Legal Footer */}
        <div className="bg-surface border border-border rounded-xl p-4 space-y-3 shadow-xs">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 font-medium text-secondary-text">
              <HelpCircle className="w-4 h-4 text-info" strokeWidth={1.75} />
              <span className="font-semibold text-primary-text">
                FindMyTang
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-light text-primary text-[11px] font-semibold">
              v{APP_VERSION}
            </span>
          </div>

          <div className="flex items-center gap-3 pt-2 mb-2 border-t border-border text-xs">
            <Button
              variant="unstyled"
              onClick={() => setIsTermsOpen(true)}
              className="text-secondary-text hover:text-primary transition-colors cursor-pointer text-xs p-0 font-medium hover:underline"
            >
              {t("termsOfService")}
            </Button>
            <span className="text-secondary-text/40">•</span>
            <Button
              variant="unstyled"
              onClick={() => setIsPrivacyOpen(true)}
              className="text-secondary-text hover:text-primary transition-colors cursor-pointer text-xs p-0 font-medium hover:underline"
            >
              {t("privacyPolicy")}
            </Button>
          </div>

          <p className="text-[10px] text-secondary-text/70">
            {t("copyrightNotice")}
          </p>
        </div>

        {/* Modals */}
        <TermsOfServiceModal
          isOpen={isTermsOpen}
          onClose={() => setIsTermsOpen(false)}
        />
        <PrivacyPolicyModal
          isOpen={isPrivacyOpen}
          onClose={() => setIsPrivacyOpen(false)}
        />
      </div>
      {/* mobile ui */}
    </>
  );
}
