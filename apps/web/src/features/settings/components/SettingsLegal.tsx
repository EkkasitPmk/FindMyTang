import { HelpCircle } from "lucide-react";
import SettingsLegalActionsClient from "./SettingsLegalActionsClient";

export default function SettingsLegal({
  version,
  termsLabel,
  privacyLabel,
  copyrightNotice,
}: Readonly<{
  version: string;
  termsLabel: string;
  privacyLabel: string;
  copyrightNotice: string;
}>) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 space-y-3 shadow-xs">
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center gap-2 font-medium text-secondary-text">
          <HelpCircle className="w-4 h-4 text-info" strokeWidth={1.75} />
          <span className="font-semibold text-primary-text">FindMyTang</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-primary-light text-primary text-[0.6875rem] font-semibold">
          v{version}
        </span>
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
