import { useEffect } from "react";
import { useI18nStore } from "../storages/i18n.storage";
import {
  translations,
  TranslationKey,
  Language,
} from "../configs/translations.config";
import { useUpdateProfileMutation } from "@/features/account/hooks/account.hook";
import { useIsGuest } from "@/shared/lib/storages/guest.storage";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";
import { useMeQuery } from "./useMeQuery.hook";

export function useTranslation() {
  const isGuest = useIsGuest();
  const { data: user } = useMeQuery({ enabled: !isGuest });
  const storeLanguage = useI18nStore((state) => state.language);
  const setStoreLanguage = useI18nStore((state) => state.setLanguage);
  const updateProfile = useUpdateProfileMutation();
  const mounted = useMounted();

  // Sync DB language preference to Zustand store when user profile loads
  useEffect(() => {
    if (!isGuest && user?.language) {
      const userLang: Language = user.language === "en" ? "en" : "th";
      if (userLang !== storeLanguage) {
        setStoreLanguage(userLang);
      }
    }
  }, [isGuest, user?.language, storeLanguage, setStoreLanguage]);

  // Determine current language: DB preference > LocalStorage persistence > default "en"
  let currentLanguage: Language = "en";
  if (mounted) {
    if (!isGuest && user?.language) {
      currentLanguage = user.language === "en" ? "en" : "th";
    } else {
      currentLanguage = storeLanguage;
    }
  }

  const t = (key: TranslationKey): string => {
    const translationSet = translations[currentLanguage] || translations.en;
    return translationSet[key] || translations.en[key] || String(key);
  };

  const changeLanguage = async (lang: Language) => {
    // 1. Save in local state store
    setStoreLanguage(lang);

    // 2. Sync to Server if user is logged in
    if (!isGuest && user) {
      try {
        await updateProfile.mutateAsync({ language: lang });
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
    isPending: updateProfile.isPending,
  };
}
