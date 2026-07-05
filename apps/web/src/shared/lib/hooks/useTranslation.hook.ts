import { useI18nStore } from "../storages/i18n.storage";
import {
  translations,
  TranslationKey,
  Language,
} from "../configs/translations.config";
import { useMeQuery } from "@/features/nav/hooks/auth.hook";
import { useUpdateProfileMutation } from "@/features/account/hooks/account.hook";
import { useIsGuest } from "@/shared/lib/storages/guest.storage";
import { useEffect, useState } from "react";

export function useTranslation() {
  const isGuest = useIsGuest();
  const { data: user } = useMeQuery({ enabled: !isGuest });
  const storeLanguage = useI18nStore((state) => state.language);
  const setStoreLanguage = useI18nStore((state) => state.setLanguage);
  const updateProfile = useUpdateProfileMutation();
  const [mounted, setMounted] = useState(false);

  // Prevent SSR Hydration Mismatch by using requestAnimationFrame (avoiding cascading sync renders)
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

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

  return {
    t,
    currentLanguage,
    changeLanguage,
    isPending: updateProfile.isPending,
  };
}
