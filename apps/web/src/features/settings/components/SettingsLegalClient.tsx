"use client";
import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import TermsOfServiceModal from "@/shared/components/customs/TermsOfServiceModal";
import PrivacyPolicyModal from "@/shared/components/customs/PrivacyPolicyModal";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

export default function SettingsLegalClient({
  version,
}: Readonly<{ version: string }>) {
  const { t } = useTranslation();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <>
      <div className="bg-surface border border-border rounded-xl p-4 space-y-3 shadow-xs">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 font-medium text-secondary-text">
            <HelpCircle className="w-4 h-4 text-info" strokeWidth={1.75} />
            <span className="font-semibold text-primary-text">FindMyTang</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-primary-light text-primary text-[0.6875rem] font-semibold">
            v{version}
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

        <p className="text-[0.625rem] text-secondary-text/70">
          {t("copyrightNotice")}
        </p>
      </div>

      <TermsOfServiceModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </>
  );
}
