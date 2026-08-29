import { HelpCircle, Wallet } from "lucide-react";
import SettingsLegalActionsClient from "./SettingsLegalActionsClient";

export default function SettingsLegal({
  termsLabel,
  privacyLabel,
  copyrightNotice,
  footer = false,
  description,
}: Readonly<{
  termsLabel: string;
  privacyLabel: string;
  copyrightNotice: string;
  footer?: boolean;
  description?: string;
}>) {
  if (footer) {
    return (
      <footer className="overflow-hidden rounded-xl border border-border bg-surface shadow-xs">
        <div className="flex flex-col justify-between gap-6 px-6 py-6 md:flex-row md:items-center">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
              <Wallet aria-hidden="true" className="size-5" strokeWidth={2} />
            </div>
            <div className="space-y-1">
              <span className="text-base font-bold tracking-tight text-primary-text">
                FindMyTang
              </span>
              {description && (
                <p className="max-w-xl text-xs leading-5 text-secondary-text">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse items-start justify-between gap-3 border-t border-border px-6 py-4 sm:flex-row sm:items-center">
          <p className="text-[0.6875rem] text-secondary-text/70">
            {copyrightNotice}
          </p>
          <SettingsLegalActionsClient
            footer
            termsLabel={termsLabel}
            privacyLabel={privacyLabel}
          />
        </div>
      </footer>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-4 space-y-3 shadow-xs">
      <div className="flex items-center text-xs">
        <div className="flex items-center gap-2 font-medium text-secondary-text">
          <HelpCircle className="w-4 h-4 text-info" strokeWidth={1.75} />
          <span className="font-semibold text-primary-text">FindMyTang</span>
        </div>
      </div>

      <SettingsLegalActionsClient
        termsLabel={termsLabel}
        privacyLabel={privacyLabel}
      />

      <p className="text-[0.625rem] text-secondary-text/70">
        {copyrightNotice}
      </p>
    </div>
  );
}
