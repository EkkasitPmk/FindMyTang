import { Suspense } from "react";
import SettingsContainer from "@/features/settings/containers/SettingsContainer";
import SettingsPageFallback from "@/features/settings/components/SettingsPageFallback";

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsPageFallback />}>
      <SettingsContainer />
    </Suspense>
  );
}
