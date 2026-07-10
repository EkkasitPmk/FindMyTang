import { useMounted } from "@/shared/lib/hooks/useMounted.hook";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Asset } from "@/features/assets/types/assets.type";
import { Category } from "@/features/category/types/category.type";
import { TransactionResponse } from "@/features/transactions/types/transaction.type";

interface GuestState {
  isGuest: boolean;
  assets: Asset[];
  categories: Category[];
  transactions: TransactionResponse[];

  // Actions
  setGuestMode: (isGuest: boolean) => void;
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, asset: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;

  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addTransaction: (transaction: TransactionResponse) => void;
  updateTransaction: (
    id: string,
    transaction: Partial<TransactionResponse>,
  ) => void;
  deleteTransaction: (id: string) => void;

  // Reset for sync
  clearGuestData: () => void;
}

export const useGuestStore = create<GuestState>()(
  persist(
    (set) => ({
      isGuest: false,
      assets: [],
      categories: [],
      transactions: [],

      setGuestMode: (isGuest) => set({ isGuest }),
      addAsset: (asset) =>
        set((state) => ({ assets: [...state.assets, asset] })),
      updateAsset: (id, updatedAsset) =>
        set((state) => ({
          assets: state.assets.map((a) =>
            a.id === id ? { ...a, ...updatedAsset } : a,
          ),
        })),
      deleteAsset: (id) =>
        set((state) => ({
          assets: state.assets.filter((a) => a.id !== id),
        })),

      addCategory: (category) =>
        set((state) => ({ categories: [...state.categories, category] })),
      updateCategory: (id, updatedCategory) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updatedCategory } : c,
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        })),
      updateTransaction: (id, updatedTransaction) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updatedTransaction } : t,
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      clearGuestData: () =>
        set({ assets: [], categories: [], transactions: [] }),
    }),
    {
      name: "pocketnote-guest-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function useIsGuest() {
  const mounted = useMounted();
  const isGuest = useGuestStore((state) => state.isGuest);

  return mounted ? isGuest : true;
}
