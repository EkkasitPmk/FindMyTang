import { LucideIcon } from "lucide-react";
import { TranslationKey } from "@/shared/lib/i18n/translations";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  translationKey?: TranslationKey;
}

