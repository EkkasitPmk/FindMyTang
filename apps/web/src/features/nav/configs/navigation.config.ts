import {
  Home,
  BookOpen,
  BarChart3,
  MoreHorizontal as More,
  Plus,
} from "lucide-react";
import { NavItem } from "../types/navigation.type";

export const navItems: NavItem[] = [
  { href: "/home", label: "Dashboard", icon: Home },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/transaction", label: "Transactions", icon: Plus },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/more", label: "More", icon: More },
];
