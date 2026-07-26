import { LucideIcon } from "lucide-react";
import { TranslationKey } from "@/shared/lib/configs/translations.config";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  translationKey?: TranslationKey;
}

