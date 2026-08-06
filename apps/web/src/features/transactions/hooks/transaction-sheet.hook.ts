import { create } from "zustand";

interface TransactionSheetState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useTransactionSheetStore = create<TransactionSheetState>(
  (set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
  }),
);
