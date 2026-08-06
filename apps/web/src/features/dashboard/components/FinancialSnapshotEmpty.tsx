import { Wallet } from "lucide-react";
import { cookies } from "next/headers";
import {
  translations,
  type TranslationKey,
} from "@/shared/lib/configs/translations.config";

export default async function FinancialSnapshotEmpty() {
  const language =
    (await cookies()).get("findmytang-language")?.value === "th" ? "th" : "en";
  const t = (key: TranslationKey) =>
    translations[language][key] ?? translations.en[key];

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-4.5 sm:p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text flex items-center gap-1.5">
          <Wallet className="size-3.5 text-primary" />
          {t("financialSnapshot")}
        </span>
      </div>
      <div>
        <span className="text-xs font-medium text-secondary-text block">
          {t("balance")}
        </span>
        <span className="text-3xl font-bold tracking-tight text-primary-text">
          ฿ 0.00
        </span>
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-border/50 text-xs text-secondary-text">
        <span className="text-primary font-medium">
          {t("startRecordingTransactions")}
        </span>
      </div>
    </div>
  );
}
