import { cn } from "@/shared/lib/utils/core.util";
import React, { forwardRef } from "react";

export interface CurrencyInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  symbol?: string;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ symbol = "฿", className, value, onChange, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-1 w-full",
          className,
        )}
      >
        <p className="text-4xl font-bold text-left w-[85%] lg:w-[95%]">
          {symbol}
        </p>
        <div className="absolute left-1/2 -translate-x-1/2">
          <input
            ref={ref}
            type="text"
            inputMode="numeric"
            placeholder="0.00"
            value={value}
            onChange={onChange}
            className={cn(
              "w-60 bg-background border-0 border-b border-border outline-none transition-all text-center text-3xl font-bold",
              "tracking-wide",
            )}
            {...props}
          />
        </div>
      </div>
    );
  },
);

CurrencyInput.displayName = "CurrencyInput";
