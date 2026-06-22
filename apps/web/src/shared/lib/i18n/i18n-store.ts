import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Language } from "./translations";

interface I18nState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      language: "th", // default language is Thai
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "pocketnote-i18n-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
