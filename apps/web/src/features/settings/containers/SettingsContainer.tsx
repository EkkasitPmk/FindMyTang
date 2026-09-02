import { getCurrentUserServer } from "@/features/account/services/account.server";
import { getAssetsServer } from "@/features/assets/services/assets.server";
import { getCategoriesServer } from "@/features/category/services/category.server";
import AccountContainer from "@/features/account/containers/AccountContainer";
import CategoryContainer from "@/features/category/containers/CategoryContainer";
import ManageAssetsContainer from "@/features/assets/containers/ManageAssetsContainer";
import type { Asset } from "@/shared/lib/types/asset.type";
import type { Category } from "@/shared/lib/types/category.type";
import {
  translations,
  type Language,
} from "@/shared/lib/configs/translations.config";
import { cookies } from "next/headers";
import FeedbackContainer from "@/features/support/feedback/containers/FeedbackContainer";
import ContactContainer from "@/features/support/contact/containers/ContactContainer";
import { ContactInfo } from "@/features/support/contact/components/ContactStaticHeader";
import SettingsDesktopTabs from "../components/SettingsDesktopTabs";
import SettingsLegal from "../components/SettingsLegal";
import SettingsMobileContainer from "./SettingsMobileContainer";

export default async function SettingsContainer() {
  const [cookieStore, initialUser, initialAssets, initialCategories] =
    await Promise.all([
      cookies(),
      getCurrentUserServer(),
      getAssetsServer(true),
      getCategoriesServer(),
    ]);
  const language: Language =
    cookieStore.get("findmytang-language")?.value === "th" ? "th" : "en";
  const t = (key: keyof (typeof translations)["en"]) =>
    translations[language][key] ?? translations.en[key];

  return (
    <>
      <div className="hidden animate-in fade-in pb-6 duration-300 lg:block">
        <SettingsDesktopTabs
          labels={{
            account: t("account"),
            categories: t("manageCategories"),
            assets: t("manageAssets"),
            feedback: t("sendFeedback"),
            contact: t("contactUs"),
          }}
          lockMessage={t("accountSettingsBackup")}
          isInitialGuest={!cookieStore.has("access_token")}
          account={
            <section className="w-full min-w-0 overflow-hidden rounded-xl border border-border bg-surface pb-4 shadow-xs">
              <div className="w-full min-w-0 lg:max-w-xl">
                <AccountContainer initialUser={initialUser} />
              </div>
            </section>
          }
          categories={
            <section className="w-full min-w-0 overflow-hidden rounded-xl border border-border bg-surface shadow-xs">
              <CategoryContainer
                embedded
                initialCategories={
                  (initialCategories as Category[] | null) ?? undefined
                }
              />
            </section>
          }
          assets={
            <section className="w-full min-w-0 overflow-hidden rounded-xl border border-border bg-surface shadow-xs">
              <ManageAssetsContainer
                embedded
                contentClassName="w-full min-w-0"
                initialAssets={(initialAssets as Asset[] | null) ?? undefined}
              />
            </section>
          }
          feedback={
            <section className="w-full min-w-0 overflow-hidden rounded-xl border border-border bg-surface shadow-xs">
              <FeedbackContainer
                contentClassName="w-full min-w-0 lg:max-w-xl"
                header={
                  <div className="flex flex-col gap-1.5 border-b border-border px-4 py-4 text-left">
                    <h2 className="text-base font-semibold text-primary-text">
                      {t("feedbackTitle")}
                    </h2>
                    <p className="text-sm text-secondary-text">
                      {t("feedbackDesc")}
                    </p>
                  </div>
                }
              />
            </section>
          }
          contact={
            <section className="w-full min-w-0 overflow-hidden rounded-xl border border-border bg-surface shadow-xs">
              <ContactContainer
                contentClassName="w-full min-w-0 lg:max-w-4xl"
                header={
                  <div className="flex flex-col gap-1.5 border-b border-border px-4 py-4 text-left">
                    <h2 className="text-base font-semibold text-primary-text">
                      {t("contactUsTitle")}
                    </h2>
                    <p className="text-sm text-secondary-text">
                      {t("contactUsDesc")}
                    </p>
                  </div>
                }
                contactInfo={<ContactInfo />}
              />
            </section>
          }
        />

        <div className="mx-auto mt-6 max-w-360">
          <SettingsLegal
            footer
            termsLabel={t("termsOfService")}
            privacyLabel={t("privacyPolicy")}
            copyrightNotice={t("copyrightNotice")}
          />
        </div>
      </div>

      <SettingsMobileContainer language={language} />
    </>
  );
}
