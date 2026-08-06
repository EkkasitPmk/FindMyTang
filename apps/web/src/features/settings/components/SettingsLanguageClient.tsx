"use client";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

export default function SettingsLanguageClient() {
  const { currentLanguage, changeLanguage } = useTranslation();

  return (
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
  );
}
