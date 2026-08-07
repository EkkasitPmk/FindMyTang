import Link from "next/link";
import { ChevronRight } from "lucide-react";
import DashboardAssetTitleMotion from "./DashboardAssetTitleMotion";
import {
  translations,
  type Language,
} from "@/shared/lib/configs/translations.config";

export default function DashboardAssetTitle({
  language,
}: Readonly<{ language: Language }>) {
  const title =
    translations[language].assetsTitle ?? translations.en.assetsTitle;

  return (
    <DashboardAssetTitleMotion>
      <Link
        href="/assets"
        className="text-lg font-medium hover:text-primary transition-colors cursor-pointer flex items-center gap-1 group"
      >
        {title}
        <ChevronRight
          size={18}
          className="text-disabled-text group-hover:text-primary transition-colors"
        />
      </Link>
    </DashboardAssetTitleMotion>
  );
}
