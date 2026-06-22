import {
  Home,
  BookOpen,
  BarChart3,
  MoreHorizontal as More,
  Plus,
} from "lucide-react";
import { NavItem } from "../types/navigation.type";

export const navItems: NavItem[] = [
  { href: "/home", label: "Dashboard", translationKey: "navHome", icon: Home },
  {
    href: "/journal",
    label: "Journal",
    translationKey: "navJournal",
    icon: BookOpen,
  },
  {
    href: "/transaction",
    label: "Transactions",
    translationKey: "navTransactions",
    icon: Plus,
  },
  {
    href: "/analytics",
    label: "Analytics",
    translationKey: "navAnalytics",
    icon: BarChart3,
  },
  { href: "/more", label: "More", translationKey: "navMore", icon: More },
];
