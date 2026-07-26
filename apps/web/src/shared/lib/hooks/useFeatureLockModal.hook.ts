import { create } from "zustand";

interface FeatureLockModalState {
  isOpen: boolean;
  featureName: string;
  openModal: (featureName: string) => void;
  closeModal: () => void;
}

export const useFeatureLockModal = create<FeatureLockModalState>((set) => ({
  isOpen: false,
  featureName: "",
  openModal: (featureName) => set({ isOpen: true, featureName }),
  closeModal: () => set({ isOpen: false, featureName: "" }),
}));
