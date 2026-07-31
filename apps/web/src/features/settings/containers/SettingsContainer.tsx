"use client";
import { useState } from "react";
import Link from "next/link";
import {
  User,
  Globe,
  ChevronRight,
  Tag,
  Wallet,
  HelpCircle,
  MessageSquareText,
  Lightbulb,
} from "lucide-react";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import TermsOfServiceModal from "@/shared/components/customs/TermsOfServiceModal";
import PrivacyPolicyModal from "@/shared/components/customs/PrivacyPolicyModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/animate-ui/components/radix/dialog";
import { useIsGuest } from "@/shared/lib/storages/guest.storage";
import { useFeatureLockModal } from "@/shared/lib/hooks/useFeatureLockModal.hook";
import { APP_VERSION } from "@/shared/lib/configs/app.config";
import FeedbackContainer from "../feedback/containers/FeedbackContainer";

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
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <div className="space-y-6 px-4 py-3 animate-in fade-in duration-300">
      {/* Profile Header */}
      <div className="space-y-2">
        <h5 className="text-[11px] font-semibold text-secondary-text uppercase tracking-wider px-1">
          {t("personalInfo")}
        </h5>
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
              <div className="p-2 rounded-lg bg-surface-secondary text-primary-text">
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
      </div>

      {/* Preferences Section */}
      <div className="space-y-2">
        <h5 className="text-[11px] font-semibold text-secondary-text uppercase tracking-wider px-1">
          {t("preferences")}
        </h5>
        <div className="bg-surface border border-border rounded-xl divide-y divide-border shadow-xs">
          {/* Language Selection */}
          <div className="flex justify-between items-center py-2 p-3.5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-surface-secondary text-primary-text">
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
        </div>
      </div>

      {/* Management Section */}
      <div className="space-y-2">
        <h5 className="text-[11px] font-semibold text-secondary-text uppercase tracking-wider px-1">
          {t("management")}
        </h5>
        <div className="bg-surface border border-border rounded-xl divide-y divide-border shadow-xs">
          <Link
            href="/categories"
            onClick={onClose}
            className="w-full flex justify-between items-center py-2 p-3.5 hover:bg-surface-secondary hover:rounded-tl-xl hover:rounded-tr-xl transition-colors text-left outline-none cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-surface-secondary text-primary-text">
                <Tag className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-semibold text-primary-text">
                {t("manageCategories")}
              </span>
            </div>
            <ChevronRight
              className="w-4 h-4 text-secondary-text/70"
              strokeWidth={1.5}
            />
          </Link>
          <Link
            href="/assets"
            onClick={onClose}
            className="w-full flex justify-between items-center py-2 p-3.5 hover:bg-surface-secondary hover:rounded-bl-xl hover:rounded-br-xl transition-colors text-left outline-none cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-surface-secondary text-primary-text">
                <Wallet className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-semibold text-primary-text">
                {t("manageAssets")}
              </span>
            </div>
            <ChevronRight
              className="w-4 h-4 text-secondary-text/70"
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </div>

      {/* Support Section */}
      <div className="space-y-2">
        <h5 className="text-[11px] font-semibold text-secondary-text uppercase tracking-wider px-1">
          {t("helpAndFeedback")}
        </h5>
        <button
          type="button"
          onClick={() => setIsHelpOpen(true)}
          className="w-full flex justify-between items-center text-left bg-surface border border-border rounded-xl p-3.5 hover:bg-surface-secondary transition-colors cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-light text-primary">
              <MessageSquareText className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <span className="block text-xs font-semibold text-primary-text">
                {t("helpAndFeedback")}
              </span>
              <span className="block text-[11px] text-secondary-text mt-0.5">
                {t("helpAndFeedbackDesc")}
              </span>
            </div>
          </div>
          <ChevronRight
            className="w-4 h-4 text-secondary-text/70"
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* App Version & Legal Footer */}
      <div className="bg-surface border border-border rounded-xl p-4 space-y-3 shadow-xs">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 font-medium text-secondary-text">
            <HelpCircle className="w-4 h-4 text-primary" strokeWidth={1.75} />
            <span className="font-semibold text-primary-text">FindMyTang</span>
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
      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="sm:max-w-md p-5">
          <DialogHeader className="pr-6">
            <DialogTitle>{t("feedbackTitle")}</DialogTitle>
            <DialogDescription>{t("feedbackDesc")}</DialogDescription>
          </DialogHeader>

          <Button
            variant="unstyled"
            type="button"
            onClick={(event) => {
              event.preventDefault();
              setIsHelpOpen(false);
              setIsFeedbackOpen(true);
            }}
            className="flex items-center gap-3 rounded-xl border border-border p-3.5 hover:bg-primary-light hover:border-primary/30 transition-colors"
          >
            <div className="rounded-lg bg-primary-light p-2 text-primary">
              <Lightbulb className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <div>
              <span className="block text-left text-sm font-semibold text-primary-text">
                {t("sendFeedback")}
              </span>
              <span className="text-xs text-secondary-text">
                {t("feedbackPlaceholder")}
              </span>
            </div>
          </Button>
        </DialogContent>
      </Dialog>
      <FeedbackContainer
        open={isFeedbackOpen}
        onClose={() => {
          setIsFeedbackOpen(false);
          setIsHelpOpen(false);
        }}
      />
    </div>
  );
}
