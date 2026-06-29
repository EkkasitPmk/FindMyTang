import { cn } from "@/shared/lib/utils";
import React from "react";

export interface CurrencyInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  symbol?: string;
}

export function CurrencyInput({
  symbol = "฿",
  className,
  ...props
}: Readonly<CurrencyInputProps>) {
  return (
    <div
      className={cn("flex items-center justify-center gap-1 w-full", className)}
    >
      <p className="text-4xl font-bold text-left w-[85%]">{symbol}</p>
      <div className="absolute left-1/2 -translate-x-1/2">
        <input
          type="text"
          inputMode="numeric"
          placeholder="0.00"
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
