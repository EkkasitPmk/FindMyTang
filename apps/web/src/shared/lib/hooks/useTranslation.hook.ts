import { useI18nStore } from "../storages/i18n.storage";
import {
  translations,
  TranslationKey,
  Language,
} from "../configs/translations.config";
import { updateProfileApi } from "@/features/account/services/account.service";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import { useRouter } from "next/navigation";

export function useTranslation() {
  const isGuest = useGuestStore((state) => state.isGuest);
  const storeLanguage = useI18nStore((state) => state.language);
  const setStoreLanguage = useI18nStore((state) => state.setLanguage);
  const router = useRouter();

  const currentLanguage: Language = storeLanguage;

  const t = (key: TranslationKey): string => {
    const translationSet = translations[currentLanguage] || translations.en;
    return translationSet[key] || translations.en[key] || String(key);
  };

  const changeLanguage = async (lang: Language) => {
    // 1. Save in local state store
    setStoreLanguage(lang);
    document.cookie = `findmytang-language=${lang}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();

    // 2. Sync to Server if user is logged in
    if (!isGuest) {
      try {
        await updateProfileApi({ language: lang });
      } catch (error) {
        console.error("Failed to sync language setting to server", error);
      }
    }
  };

  const locale = currentLanguage === "th" ? "th-TH" : "en-US";

  return {
    t,
    currentLanguage,
    locale,
    changeLanguage,
    isPending: false,
  };
}
