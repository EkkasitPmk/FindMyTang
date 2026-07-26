import { useState, useCallback, useMemo } from "react";
import { ModalStatus } from "@/shared/components/customs/LoadingModal";

export interface ModalState {
  isOpen: boolean;
  status: ModalStatus;
  message?: string;
  shouldRedirect?: boolean;
}

export function useModalState<
  T extends Record<string, unknown> = Record<string, unknown>,
>(initialState?: Partial<ModalState & T>) {
  const defaultState = useMemo(
    () =>
      ({
        isOpen: false,
        status: "loading",
        message: "",
        ...initialState,
      }) as ModalState & T,
    [initialState],
  );

  const [modalState, setModalState] = useState<ModalState & T>(defaultState);

  const resetModalState = useCallback(() => {
    setModalState(defaultState);
  }, [defaultState]);

  const closeModal = useCallback(() => {
    setModalState(defaultState);
  }, [defaultState]);

  return {
    modalState,
    setModalState,
    resetModalState,
    closeModal,
  };
}
