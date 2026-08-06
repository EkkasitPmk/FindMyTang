import type { ChangeEvent, RefObject } from "react";
import { CurrencyInput } from "@/shared/components/customs/CurrencyInput";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface TransactionAmountFieldProps {
  isLoading: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  displayAmount: string;
  numericAmount: number | string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  showError: boolean;
  errorMessage?: string;
}

export default function TransactionAmountField({
  isLoading,
  inputRef,
  displayAmount,
  numericAmount,
  onChange,
  showError,
  errorMessage,
}: Readonly<TransactionAmountFieldProps>) {
  return (
    <section className="flex flex-col items-center gap-1 relative min-h-10 justify-center">
      {isLoading ? (
        <Skeleton className="w-60 h-10 rounded-lg" />
      ) : (
        <>
          <CurrencyInput
            id="transaction-amount"
            ref={inputRef}
            value={displayAmount}
            onChange={onChange}
          />
          <input type="hidden" name="amount" value={numericAmount} />
          {showError && errorMessage && (
            <p className="text-expense text-xs">{errorMessage}</p>
          )}
        </>
      )}
    </section>
  );
}
