import {
  Globe,
  Lightbulb,
  MessageSquareText,
  Moon,
  Tag,
  Wallet,
} from "lucide-react";
import { APP_VERSION } from "@/shared/lib/configs/app.config";
import {
  translations,
  type Language,
} from "@/shared/lib/configs/translations.config";
import SettingsMenuItem from "../components/SettingsMenuItem";
import SettingsSection from "../components/SettingsSection";
import SettingsAccountLinkClient from "../components/SettingsAccountLinkClient";
import SettingsLanguageClient from "../components/SettingsLanguageClient";
import SettingsLegal from "../components/SettingsLegal";
import SettingsThemeClient from "../components/SettingsThemeClient";

export default function SettingsMobileContainer({
  language,
}: Readonly<{ language: Language }>) {
  const t = (key: keyof (typeof translations)["en"]) =>
    translations[language][key] ?? translations.en[key];

  return (
    <div className="lg:hidden space-y-6 px-4 py-3 sm:p-0 animate-in fade-in duration-300">
      <SettingsSection title={t("personalInfo")}>
        <SettingsAccountLinkClient
          label={t("account")}
          lockMessage={t("accountSettingsBackup")}
        />
      </SettingsSection>

      <SettingsSection title={t("preferences")}>
        <div className="bg-surface border border-border rounded-xl divide-y divide-border shadow-xs">
          <div className="flex justify-between items-center py-2 p-3.5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-transfer/20 text-transfer">
                <Globe className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-semibold text-primary-text">
                {t("language")}
              </span>
            </div>
            <SettingsLanguageClient />
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
            <SettingsThemeClient />
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
          />
          <SettingsMenuItem
            href="/assets"
            label={t("manageAssets")}
            icon={Wallet}
            iconClassName="text-income"
            iconBackgroundClassName="bg-income-light"
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
          />
          <SettingsMenuItem
            href="/support/contact"
            label={t("contactUs")}
            icon={MessageSquareText}
            iconClassName="text-primary"
            iconBackgroundClassName="bg-primary-light"
          />
        </div>
      </SettingsSection>

      <SettingsLegal
        version={APP_VERSION}
        termsLabel={t("termsOfService")}
        privacyLabel={t("privacyPolicy")}
        copyrightNotice={t("copyrightNotice")}
      />
    </div>
  );
}
