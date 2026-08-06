import { Home, BookOpen, BarChart3, Plus } from "lucide-react";
import { NavItem } from "../types/navigation.type";

export const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    translationKey: "navDashboard",
    icon: Home,
    mobilePlacement: "primary",
  },
  {
    href: "/journal",
    label: "Journal",
    translationKey: "navJournal",
    icon: BookOpen,
    mobilePlacement: "primary",
  },
  {
    href: "/transaction",
    label: "Transactions",
    translationKey: "navTransactions",
    icon: Plus,
    mobilePlacement: "primary",
  },
  {
    href: "/analytics",
    label: "Analytics",
    translationKey: "navAnalytics",
    icon: BarChart3,
    mobilePlacement: "primary",
  },
];
