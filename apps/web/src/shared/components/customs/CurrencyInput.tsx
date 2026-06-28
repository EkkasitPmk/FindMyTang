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
    <div className={cn("flex items-center justify-center gap-1", className)}>
      <span className="text-4xl font-bold">{symbol}</span>
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
  );
}
