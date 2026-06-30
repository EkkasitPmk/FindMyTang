import { cn } from "@/shared/lib/utils/core.util";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

export interface CurrencyInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  symbol?: string;
}

const useIsomorphicLayoutEffect =
  globalThis.window === undefined ? useEffect : useLayoutEffect;

export function CurrencyInput({
  symbol = "฿",
  className,
  value,
  onChange,
  ...props
}: Readonly<CurrencyInputProps>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [digitsAfterCursorTarget, setDigitsAfterCursorTarget] = useState<
    number | null
  >(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const selectionStart = e.target.selectionStart || 0;

    // Count how many valid characters (digits or dot) are AFTER the NEW cursor position
    let digitsAfterCursor = 0;
    for (let i = selectionStart; i < rawValue.length; i++) {
      if (/[0-9.]/.test(rawValue[i])) digitsAfterCursor++;
    }

    setDigitsAfterCursorTarget(digitsAfterCursor);
    onChange?.(e);
  };

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

  return (
    <div
      className={cn("flex items-center justify-center gap-1 w-full", className)}
    >
      <p className="text-4xl font-bold text-left w-[85%]">{symbol}</p>
      <div className="absolute left-1/2 -translate-x-1/2">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          placeholder="0.00"
          value={value}
          onChange={handleChange}
          className={cn(
            "w-60 bg-background border-0 border-b border-border outline-none transition-all text-center text-3xl font-bold",
            "tracking-wide",
          )}
          {...props}
        />
      </div>
    </div>
  );
}
