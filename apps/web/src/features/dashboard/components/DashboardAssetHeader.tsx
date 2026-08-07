import DashboardAssetActions from "./DashboardAssetActions";
import DashboardAssetTitle from "./DashboardAssetTitle";
import type { Language } from "@/shared/lib/configs/translations.config";

export default function DashboardAssetHeader({
  language,
}: Readonly<{ language: Language }>) {
  return (
    <div className="flex items-center justify-between mb-2">
      <DashboardAssetTitle language={language} />
      <DashboardAssetActions />
    </div>
  );
}
