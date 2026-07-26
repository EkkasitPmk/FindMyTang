import { useMounted } from "@/shared/lib/hooks/useMounted.hook";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { persist, createJSONStorage } from "zustand/middleware";
import { db, CategoryType, LocalCategory } from "./dexie.storage";

interface GuestState {
  isGuest: boolean;
  setGuestMode: (isGuest: boolean) => void;
  // This will clear Dexie DB and set Guest mode to false
  clearGuestData: () => Promise<void>;
  // This runs auto-deletion of items > 30 days old
  runAutoDeleteTasks: () => Promise<void>;
  // This seeds default categories and assets for fresh guest users
  seedDefaultGuestData: () => Promise<void>;
}

export const useGuestStore = create<GuestState>()(
  persist(
    (set, get) => ({
      isGuest: true,
      setGuestMode: (isGuest) => set({ isGuest }),

      clearGuestData: async () => {
        await Promise.all([
          db.assets.clear(),
          db.categories.clear(),
          db.transactions.clear(),
        ]);
      },

      seedDefaultGuestData: async () => {
        if (!get().isGuest) return;

        const categoryCount = await db.categories.count();
        if (categoryCount === 0) {
          const now = new Date().toISOString();

          const defaultCategories: LocalCategory[] = [
            // Expense
            {
              id: uuidv4(),
              name: "Food",
              type: CategoryType.EXPENSE,
              icon: "food",
              color: "#FF8700",
              displayOrder: 1,
              isSystem: true,
              createdAt: now,
              updatedAt: now,
              syncStatus: "pending",
            },
            {
              id: uuidv4(),
              name: "Snack",
              type: CategoryType.EXPENSE,
              icon: "snack",
              color: "#ED54B4",
              displayOrder: 2,
              isSystem: true,
              createdAt: now,
              updatedAt: now,
              syncStatus: "pending",
            },
            {
              id: uuidv4(),
              name: "Drink",
              type: CategoryType.EXPENSE,
              icon: "drink",
              color: "#FFE666",
              displayOrder: 3,
              isSystem: true,
              createdAt: now,
              updatedAt: now,
              syncStatus: "pending",
            },
            {
              id: uuidv4(),
              name: "Phone",
              type: CategoryType.EXPENSE,
              icon: "phone",
              color: "#696969",
              displayOrder: 4,
              isSystem: true,
              createdAt: now,
              updatedAt: now,
              syncStatus: "pending",
            },
            {
              id: uuidv4(),
              name: "Transport",
              type: CategoryType.EXPENSE,
              icon: "transport",
              color: "#A9673C",
              displayOrder: 5,
              isSystem: true,
              createdAt: now,
              updatedAt: now,
              syncStatus: "pending",
            },
            {
              id: uuidv4(),
              name: "Personal",
              type: CategoryType.EXPENSE,
              icon: "personal",
              color: "#42D2C1",
              displayOrder: 6,
              isSystem: true,
              createdAt: now,
              updatedAt: now,
              syncStatus: "pending",
            },
            {
              id: uuidv4(),
              name: "Home",
              type: CategoryType.EXPENSE,
              icon: "home",
              color: "#A7BE00",
              displayOrder: 7,
              isSystem: true,
              createdAt: now,
              updatedAt: now,
              syncStatus: "pending",
            },
            {
              id: uuidv4(),
              name: "Laundry",
              type: CategoryType.EXPENSE,
              icon: "laundry",
              color: "#1638A7",
              displayOrder: 8,
              isSystem: true,
              createdAt: now,
              updatedAt: now,
              syncStatus: "pending",
            },
            {
              id: uuidv4(),
              name: "Household",
              type: CategoryType.EXPENSE,
              icon: "household",
              color: "#09CEFF",
              displayOrder: 9,
              isSystem: true,
              createdAt: now,
              updatedAt: now,
              syncStatus: "pending",
            },
            {
              id: uuidv4(),
              name: "Cosmetic",
              type: CategoryType.EXPENSE,
              icon: "cosmetic",
              color: "#990BA6",
              displayOrder: 10,
              isSystem: true,
              createdAt: now,
              updatedAt: now,
              syncStatus: "pending",
            },
            {
              id: uuidv4(),
              name: "Medical",
              type: CategoryType.EXPENSE,
              icon: "medical",
              color: "#61E396",
              displayOrder: 11,
              isSystem: true,
              createdAt: now,
              updatedAt: now,
              syncStatus: "pending",
            },
            {
              id: uuidv4(),
              name: "Education",
              type: CategoryType.EXPENSE,
              icon: "education",
              color: "#FF4950",
              displayOrder: 12,
              isSystem: true,
              createdAt: now,
              updatedAt: now,
              syncStatus: "pending",
            },
            {
              id: uuidv4(),
              name: "Other",
              type: CategoryType.EXPENSE,
              icon: "other",
              color: "#FF0000",
              displayOrder: 13,
              isSystem: true,
              createdAt: now,
              updatedAt: now,
              syncStatus: "pending",
            },

            // Income
            {
              id: uuidv4(),
              name: "Salary",
              type: CategoryType.INCOME,
              icon: "salary",
              color: "#4EB46A",
              displayOrder: 1,
              isSystem: true,
              createdAt: now,
              updatedAt: now,
              syncStatus: "pending",
            },
            {
              id: uuidv4(),
              name: "Wallet",
              type: CategoryType.INCOME,
              icon: "wallet",
              color: "#FFB27F",
              displayOrder: 2,
              isSystem: true,
              createdAt: now,
              updatedAt: now,
              syncStatus: "pending",
            },
            {
              id: uuidv4(),
              name: "Bonus",
              type: CategoryType.INCOME,
              icon: "bonus",
              color: "#FF2E00",
              displayOrder: 3,
              isSystem: true,
              createdAt: now,
              updatedAt: now,
              syncStatus: "pending",
            },
            {
              id: uuidv4(),
              name: "Freelance",
              type: CategoryType.INCOME,
              icon: "freelance",
              color: "#00C7FF",
              displayOrder: 4,
              isSystem: true,
              createdAt: now,
              updatedAt: now,
              syncStatus: "pending",
            },
            {
              id: uuidv4(),
              name: "Investment",
              type: CategoryType.INCOME,
              icon: "investment",
              color: "#42D2C1",
              displayOrder: 5,
              isSystem: true,
              createdAt: now,
              updatedAt: now,
              syncStatus: "pending",
            },
            {
              id: uuidv4(),
              name: "Other",
              type: CategoryType.INCOME,
              icon: "other",
              color: "#F98BBE",
              displayOrder: 6,
              isSystem: true,
              createdAt: now,
              updatedAt: now,
              syncStatus: "pending",
            },
            {
              id: uuidv4(),
              name: "Personal",
              type: CategoryType.INCOME,
              icon: "personal",
              color: "#42D2C1",
              displayOrder: 7,
              isSystem: true,
              createdAt: now,
              updatedAt: now,
              syncStatus: "pending",
            },
          ];
          await db.categories.bulkAdd(defaultCategories);
        }
      },

      runAutoDeleteTasks: async () => {
        if (!get().isGuest) return;

        const cutoff = new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000,
        ).toISOString();

        await db.transaction(
          "rw",
          [db.assets, db.categories, db.transactions],
          async () => {
            const deleteOld = async (
              table:
                | typeof db.assets
                | typeof db.categories
                | typeof db.transactions,
            ) => {
              const ids = await table
                .where("deletedAt")
                .belowOrEqual(cutoff)
                .primaryKeys();
              if (ids.length > 0) await table.bulkDelete(ids as string[]);
            };

            await deleteOld(db.assets);
            await deleteOld(db.categories);
            await deleteOld(db.transactions);
          },
        );
      },
    }),
    {
      name: "findmytang-guest-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function useIsGuest() {
  const mounted = useMounted();
  const isGuest = useGuestStore((state) => state.isGuest);

  return mounted ? isGuest : true;
}

export async function getGuestDataCount() {
  const [assets, categories, transactions] = await Promise.all([
    db.assets.count(),
    db.categories.filter((category) => !category.isSystem).count(),
    db.transactions.count(),
  ]);
  return assets + categories + transactions;
}
