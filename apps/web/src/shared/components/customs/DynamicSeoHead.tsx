"use client";
import { useEffect } from "react";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

export default function DynamicSeoHead() {
  const { t, currentLanguage } = useTranslation();

  useEffect(() => {
    const title = t("appTitle");
    const description = t("appDescription");

    document.title = title;

    // Update document HTML lang attribute
    document.documentElement.lang = currentLanguage;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);
  }, [t, currentLanguage]);

  return null;
}
