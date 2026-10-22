"use client";
import { Input } from "@/shared/components/customs/Input";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { cn } from "@/shared/lib/utils/core.util";

interface RecurringAmountFieldProps {
  id?: string;
  value: number | "";
  onChange: (value: number | "") => void;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export function RecurringAmountField({
  id = "recurring-form-amount",
  value,
  onChange,
  error = false,
  errorMessage,
  label,
  required = true,
  className,
}: Readonly<RecurringAmountFieldProps>) {
  const { t } = useTranslation();

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-secondary-text">
        {label ?? t("recurringAmountLabel")} (THB){required ? " *" : ""}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="font-semibold text-disabled-text">฿</span>
        </div>
        <Input
          id={id}
          type="number"
          step="any"
          min="0.01"
          inputMode="decimal"
          placeholder="0.00"
          value={value}
          onChange={(e) =>
            onChange(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="pl-9 font-semibold text-base sm:text-lg"
          error={error}
        />
      </div>
      {error && errorMessage && (
        <p className="text-xs text-destructive font-medium">{errorMessage}</p>
      )}
    </div>
  );
}

export default RecurringAmountField;
