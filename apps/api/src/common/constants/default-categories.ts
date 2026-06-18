import { CategoryType } from "@prisma/client";

export interface DefaultCategory {
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  displayOrder: number;
}

const primaryTealColor = "#42D2C1";

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  // Expense
  {
    name: "อาหาร",
    type: CategoryType.EXPENSE,
    icon: "food",
    color: "#FF8700",
    displayOrder: 1,
  },
  {
    name: "ขนม",
    type: CategoryType.EXPENSE,
    icon: "snack",
    color: "#ED54B4",
    displayOrder: 2,
  },
  {
    name: "ชานม",
    type: CategoryType.EXPENSE,
    icon: "drink",
    color: "#FFE666",
    displayOrder: 3,
  },
  {
    name: "โทรศัพท์",
    type: CategoryType.EXPENSE,
    icon: "phone",
    color: "#696969",
    displayOrder: 4,
  },
  {
    name: "ยานพาหนะ",
    type: CategoryType.EXPENSE,
    icon: "transport",
    color: "#A9673C",
    displayOrder: 5,
  },
  {
    name: "ส่วนตัว",
    type: CategoryType.EXPENSE,
    icon: "personal",
    color: primaryTealColor,
    displayOrder: 6,
  },
  {
    name: "ที่อยู่",
    type: CategoryType.EXPENSE,
    icon: "home",
    color: "#A7BE00",
    displayOrder: 7,
  },
  {
    name: "ซักผ้า",
    type: CategoryType.EXPENSE,
    icon: "laundry",
    color: "#1638A7",
    displayOrder: 8,
  },
  {
    name: "เครื่องใช้ในครัวเรือน",
    type: CategoryType.EXPENSE,
    icon: "household",
    color: "#09CEFF",
    displayOrder: 9,
  },
  {
    name: "เครื่องสำอาง",
    type: CategoryType.EXPENSE,
    icon: "cosmetic",
    color: "#990BA6",
    displayOrder: 10,
  },
  {
    name: "การแพทย์",
    type: CategoryType.EXPENSE,
    icon: "medical",
    color: "#61E396",
    displayOrder: 11,
  },
  {
    name: "การศึกษา",
    type: CategoryType.EXPENSE,
    icon: "education",
    color: "#FF4950",
    displayOrder: 12,
  },
  {
    name: "ตกหล่น",
    type: CategoryType.EXPENSE,
    icon: "other",
    color: "#FF0000",
    displayOrder: 13,
  },

  // Income
  {
    name: "เงินเดือน",
    type: CategoryType.INCOME,
    icon: "salary",
    color: "#4EB46A",
    displayOrder: 1,
  },
  {
    name: "เงินติดตัว",
    type: CategoryType.INCOME,
    icon: "wallet",
    color: "#FFB27F",
    displayOrder: 2,
  },
  {
    name: "เงินโบนัส",
    type: CategoryType.INCOME,
    icon: "bonus",
    color: "#FF2E00",
    displayOrder: 3,
  },
  {
    name: "งานเสริม",
    type: CategoryType.INCOME,
    icon: "freelance",
    color: "#00C7FF",
    displayOrder: 4,
  },
  {
    name: "การลงทุน",
    type: CategoryType.INCOME,
    icon: "investment",
    color: primaryTealColor,
    displayOrder: 5,
  },
  {
    name: "อื่นๆ",
    type: CategoryType.INCOME,
    icon: "other",
    color: "#F98BBE",
    displayOrder: 6,
  },
  {
    name: "ส่วนตัว",
    type: CategoryType.INCOME,
    icon: "personal",
    color: primaryTealColor,
    displayOrder: 7,
  },
];
