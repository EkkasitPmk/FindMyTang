import { Mail } from "lucide-react";
import { cookies } from "next/headers";
import {
  translations,
  type Language,
} from "@/shared/lib/configs/translations.config";

export async function ContactStaticHeader() {
  const language: Language =
    (await cookies()).get("findmytang-language")?.value === "th" ? "th" : "en";
  const t = translations[language];

  return (
    <div className="flex shrink-0 flex-col gap-1.5 border-b border-border px-4 py-4 md:pt-0 text-left">
      <h1 className="text-base font-semibold text-primary-text">
        {t.contactUsTitle}
      </h1>
      <p className="text-sm text-secondary-text">{t.contactUsDesc}</p>
    </div>
  );
}

export function ContactInfo() {
  return (
    <div className="h-fit rounded-md border border-border px-4 py-4">
      <Mail className="mb-3 text-primary" />
      <span className="block text-sm font-semibold text-primary-text">
        Email
      </span>
      <a
        href="mailto:ekkasit.phumiket@gmail.com"
        className="break-all text-sm text-secondary-text hover:text-primary"
      >
        ekkasit.phumiket@gmail.com
      </a>
    </div>
  );
}
