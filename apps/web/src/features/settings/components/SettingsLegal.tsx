import SettingsLegalActionsClient from "./SettingsLegalActionsClient";

export default function SettingsLegal({
  termsLabel,
  privacyLabel,
  copyrightNotice,
  footer = false,
}: Readonly<{
  termsLabel: string;
  privacyLabel: string;
  copyrightNotice: string;
  footer?: boolean;
}>) {
  const Container = footer ? "footer" : "div";

  return (
    <Container className="flex flex-col items-center justify-center gap-1.5 py-4 text-center">
      <p className="text-xs text-secondary-text/70">{copyrightNotice}</p>
      <SettingsLegalActionsClient
        termsLabel={termsLabel}
        privacyLabel={privacyLabel}
      />
    </Container>
  );
}
