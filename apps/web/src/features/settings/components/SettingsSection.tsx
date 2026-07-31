import type { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

export default function SettingsSection({
  title,
  children,
}: Readonly<SettingsSectionProps>) {
  return (
    <section className="space-y-2">
      <h5 className="text-[11px] font-semibold text-secondary-text uppercase tracking-wider px-1">
        {title}
      </h5>
      {children}
    </section>
  );
}
