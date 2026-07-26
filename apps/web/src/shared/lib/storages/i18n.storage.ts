import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Language } from "../configs/translations.config";

interface I18nState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      language: "en", // default language is English
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "findmytang-i18n-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
