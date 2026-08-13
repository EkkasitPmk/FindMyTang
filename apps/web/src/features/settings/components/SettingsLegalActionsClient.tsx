"use client";
import { useState } from "react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import TermsOfServiceModal from "@/shared/components/customs/TermsOfServiceModal";
import PrivacyPolicyModal from "@/shared/components/customs/PrivacyPolicyModal";

export default function SettingsLegalActionsClient({
  termsLabel,
  privacyLabel,
}: Readonly<{ termsLabel: string; privacyLabel: string }>) {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 pt-2 mb-2 border-t border-border text-xs">
        <Button
          variant="unstyled"
          onClick={() => setIsTermsOpen(true)}
          className="text-secondary-text hover:text-primary transition-colors cursor-pointer text-xs p-0 font-medium hover:underline"
        >
          {termsLabel}
        </Button>
        <span className="text-secondary-text/40">•</span>
        <Button
          variant="unstyled"
          onClick={() => setIsPrivacyOpen(true)}
          className="text-secondary-text hover:text-primary transition-colors cursor-pointer text-xs p-0 font-medium hover:underline"
        >
          {privacyLabel}
        </Button>
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
