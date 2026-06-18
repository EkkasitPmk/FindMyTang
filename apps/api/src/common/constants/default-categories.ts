import { CategoryType } from "@prisma/client";

export interface DefaultCategory {
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
}

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  // Expenses
  {
    name: "อาหารและเครื่องดื่ม",
    type: CategoryType.EXPENSE,
    icon: "🍔",
    color: "#FF5733",
  },
  {
    name: "การเดินทาง",
    type: CategoryType.EXPENSE,
    icon: "🚗",
    color: "#33FF57",
  },
  {
    name: "ช้อปปิ้ง",
    type: CategoryType.EXPENSE,
    icon: "🛒",
    color: "#3357FF",
  },
  {
    name: "ที่อยู่อาศัย",
    type: CategoryType.EXPENSE,
    icon: "🏠",
    color: "#F333FF",
  },
  {
    name: "ค่าน้ำ/ค่าไฟ",
    type: CategoryType.EXPENSE,
    icon: "💡",
    color: "#33FFFF",
  },
  { name: "บันเทิง", type: CategoryType.EXPENSE, icon: "🎮", color: "#FF33A8" },
  { name: "สุขภาพ", type: CategoryType.EXPENSE, icon: "🏥", color: "#FF3333" },
  {
    name: "การศึกษา",
    type: CategoryType.EXPENSE,
    icon: "📚",
    color: "#33FF33",
  },
  { name: "อื่นๆ", type: CategoryType.EXPENSE, icon: "📦", color: "#888888" },

  // Income
  {
    name: "เงินเดือน",
    type: CategoryType.INCOME,
    icon: "💰",
    color: "#FFD700",
  },
  { name: "โบนัส", type: CategoryType.INCOME, icon: "🎊", color: "#FF8C00" },
  { name: "การลงทุน", type: CategoryType.INCOME, icon: "📈", color: "#32CD32" },
  { name: "ของขวัญ", type: CategoryType.INCOME, icon: "🎁", color: "#FF69B4" },
  { name: "อื่นๆ", type: CategoryType.INCOME, icon: "💵", color: "#888888" },
];
