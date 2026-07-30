import { CategoryType } from "../storages/dexie.storage";

export const GUEST_STORAGE_KEYS = {
  state: "findmytang-guest-storage",
  seeded: "findmytang-guest-seeded",
  lastAutodelete: "findmytang-guest-last-autodelete",
} as const;

export const GUEST_AUTO_DELETE_AFTER_DAYS = 30;

export interface GuestCategoryConfig {
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  displayOrder: number;
}

export const DEFAULT_GUEST_CATEGORIES: readonly GuestCategoryConfig[] = [
  { name: "Food", type: CategoryType.EXPENSE, icon: "food", color: "#FF8700", displayOrder: 1 },
  { name: "Snack", type: CategoryType.EXPENSE, icon: "snack", color: "#ED54B4", displayOrder: 2 },
  { name: "Drink", type: CategoryType.EXPENSE, icon: "drink", color: "#FFE666", displayOrder: 3 },
  { name: "Phone", type: CategoryType.EXPENSE, icon: "phone", color: "#696969", displayOrder: 4 },
  { name: "Transport", type: CategoryType.EXPENSE, icon: "transport", color: "#A9673C", displayOrder: 5 },
  { name: "Personal", type: CategoryType.EXPENSE, icon: "personal", color: "#42D2C1", displayOrder: 6 },
  { name: "Home", type: CategoryType.EXPENSE, icon: "home", color: "#A7BE00", displayOrder: 7 },
  { name: "Laundry", type: CategoryType.EXPENSE, icon: "laundry", color: "#1638A7", displayOrder: 8 },
  { name: "Household", type: CategoryType.EXPENSE, icon: "household", color: "#09CEFF", displayOrder: 9 },
  { name: "Cosmetic", type: CategoryType.EXPENSE, icon: "cosmetic", color: "#990BA6", displayOrder: 10 },
  { name: "Medical", type: CategoryType.EXPENSE, icon: "medical", color: "#61E396", displayOrder: 11 },
  { name: "Education", type: CategoryType.EXPENSE, icon: "education", color: "#FF4950", displayOrder: 12 },
  { name: "Other", type: CategoryType.EXPENSE, icon: "other", color: "#FF0000", displayOrder: 13 },
  { name: "Salary", type: CategoryType.INCOME, icon: "salary", color: "#4EB46A", displayOrder: 1 },
  { name: "Wallet", type: CategoryType.INCOME, icon: "wallet", color: "#FFB27F", displayOrder: 2 },
  { name: "Bonus", type: CategoryType.INCOME, icon: "bonus", color: "#FF2E00", displayOrder: 3 },
  { name: "Freelance", type: CategoryType.INCOME, icon: "freelance", color: "#00C7FF", displayOrder: 4 },
  { name: "Investment", type: CategoryType.INCOME, icon: "investment", color: "#42D2C1", displayOrder: 5 },
  { name: "Other", type: CategoryType.INCOME, icon: "other", color: "#F98BBE", displayOrder: 6 },
  { name: "Personal", type: CategoryType.INCOME, icon: "personal", color: "#42D2C1", displayOrder: 7 },
];
