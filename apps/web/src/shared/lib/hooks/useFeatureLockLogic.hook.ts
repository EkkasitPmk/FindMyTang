"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFeatureLockModal } from "./useFeatureLockModal.hook";

export function useFeatureLockLogic() {
  const { isOpen, featureName, closeModal } = useFeatureLockModal();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (isOpen) {
      globalThis.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeModal]);

  const handleSignUp = () => {
    closeModal();
    router.push("/login?tab=register");
  };

  return {
    isReady: isOpen,
    isOpen,
    featureName,
    onClose: closeModal,
    onSignUp: handleSignUp,
  };
}
