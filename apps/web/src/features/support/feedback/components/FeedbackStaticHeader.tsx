import { cookies } from "next/headers";
import {
  translations,
  type Language,
} from "@/shared/lib/configs/translations.config";

export default async function FeedbackStaticHeader() {
  const language: Language =
    (await cookies()).get("findmytang-language")?.value === "th" ? "th" : "en";
  const t = translations[language];

  return (
    <div className="flex shrink-0 flex-col gap-1.5 border-b border-border px-4 py-4 md:pt-0 text-left">
      <h1 className="text-base font-semibold text-primary-text">
        {t.feedbackTitle}
      </h1>
      <p className="text-sm text-secondary-text">{t.feedbackDesc}</p>
    </div>
  );
}
