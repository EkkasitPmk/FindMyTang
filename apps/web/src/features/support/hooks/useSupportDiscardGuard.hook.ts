import { useEffect } from "react";
import { useModalState } from "@/shared/lib/hooks/useModalState.hook";

export function useSupportDiscardGuard(isDirty: boolean) {
  const { modalState, setModalState, resetModalState } = useModalState();

  useEffect(() => {
    const handleBeforeBack = (event: Event) => {
      if (!isDirty) return;

      const supportEvent = event as CustomEvent<{ handled: boolean }>;
      supportEvent.detail.handled = true;
      setModalState({ isOpen: true, status: "warning", message: "" });
    };

    window.addEventListener("support:before-back", handleBeforeBack);
    return () =>
      window.removeEventListener("support:before-back", handleBeforeBack);
  }, [isDirty, setModalState]);

  return { modalState, setModalState, resetModalState };
}
