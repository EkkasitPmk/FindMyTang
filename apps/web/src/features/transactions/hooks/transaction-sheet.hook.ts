import { create } from "zustand";
import type { TransactionResponse } from "@/shared/lib/types/transaction.type";

interface TransactionSheetState {
  isOpen: boolean;
  transaction: TransactionResponse | null;
  open: (transaction?: TransactionResponse) => void;
  close: () => void;
}

export const useTransactionSheetStore = create<TransactionSheetState>(
  (set) => ({
    isOpen: false,
    transaction: null,
    open: (transaction) =>
      set({ isOpen: true, transaction: transaction ?? null }),
    close: () => set({ isOpen: false, transaction: null }),
  }),
);
