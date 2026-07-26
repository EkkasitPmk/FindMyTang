import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";

const useIsomorphicLayoutEffect =
  globalThis.window === undefined ? useEffect : useLayoutEffect;

export function useCurrencyInput(
  value: string | number | readonly string[] | undefined,
  onChange?: React.ChangeEventHandler<HTMLInputElement>,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [digitsAfterCursorTarget, setDigitsAfterCursorTarget] = useState<
    number | null
  >(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const selectionStart = e.target.selectionStart || 0;

      // Count how many valid characters (digits or dot) are AFTER the NEW cursor position
      let digitsAfterCursor = 0;
      for (let i = selectionStart; i < rawValue.length; i++) {
        if (/[0-9.]/.test(rawValue[i])) digitsAfterCursor++;
      }

      setDigitsAfterCursorTarget(digitsAfterCursor);
      onChange?.(e);
    },
    [onChange],
  );

  useIsomorphicLayoutEffect(() => {
    const input = inputRef.current;
    if (input && digitsAfterCursorTarget !== null) {
      const newVal = String(value || "");

      // Find the new cursor position by counting valid characters from the RIGHT
      let newCursor = newVal.length;
      let digitsSeen = 0;
      let matched = false;

      for (let i = newVal.length - 1; i >= 0; i--) {
        if (digitsSeen === digitsAfterCursorTarget) {
          newCursor = i + 1;
          matched = true;
          break;
        }
        if (/[0-9.]/.test(newVal[i])) digitsSeen++;
        newCursor = i; // Move cursor leftwards
      }

      // Handle edge case where we want to be at the very beginning
      if (!matched && digitsSeen === digitsAfterCursorTarget) {
        newCursor = 0;
      }

      input.setSelectionRange(newCursor, newCursor);
    }
  }, [value, digitsAfterCursorTarget]);

  return {
    inputRef,
    handleChange,
  };
}
