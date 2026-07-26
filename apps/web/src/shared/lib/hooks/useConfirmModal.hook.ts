import { useState, useCallback } from "react";

export function useConfirmModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHardDelete, setIsHardDelete] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const open = useCallback(() => setIsOpen(true), []);

  const close = useCallback(() => {
    setIsOpen(false);
    setIsHardDelete(false);
    setInputValue("");
  }, []);

  return {
    isOpen,
    isHardDelete,
    inputValue,
    open,
    close,
    setIsHardDelete,
    setInputValue,
  };
}
