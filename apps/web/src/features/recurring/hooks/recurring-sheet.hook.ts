import { create } from "zustand";
import type { RecurringExpense } from "@/shared/lib/types/recurring.type";

interface RecurringSheetState {
  isOpen: boolean;
  itemToEdit: RecurringExpense | null;
  open: (item?: RecurringExpense) => void;
  close: () => void;
}

export const useRecurringSheetStore = create<RecurringSheetState>((set) => ({
  isOpen: false,
  itemToEdit: null,
  open: (item) => set({ isOpen: true, itemToEdit: item ?? null }),
  close: () => set({ isOpen: false, itemToEdit: null }),
}));

interface RecurringLogModalState {
  isOpen: boolean;
  itemToLog: RecurringExpense | null;
  open: (item: RecurringExpense) => void;
  close: () => void;
}

export const useRecurringLogModalStore = create<RecurringLogModalState>(
  (set) => ({
    isOpen: false,
    itemToLog: null,
    open: (item) => set({ isOpen: true, itemToLog: item }),
    close: () => set({ isOpen: false, itemToLog: null }),
  }),
);
