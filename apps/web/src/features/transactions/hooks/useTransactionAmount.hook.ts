import { useCallback, useState } from "react";
import type { ChangeEvent } from "react";
import type { UseFormSetValue } from "react-hook-form";
import {
  convertDigitsToAmount,
  getFormattedAmount,
  parseAmountDigits,
} from "@/shared/lib/utils/currency.util";
import type { CreateTransactionFormValues } from "../schemas/transaction.form.schema";
import { useCurrencyInput } from "./useCurrencyInput.hook";

export function useTransactionAmount(
  setValue: UseFormSetValue<CreateTransactionFormValues>,
) {
  const [amountDigits, setAmountDigits] = useState("");
  const { displayAmount, numericAmount } = getFormattedAmount(amountDigits);

  const handleAmountChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const digits = parseAmountDigits(event.target.value);
      setAmountDigits(digits);
      setValue("amount", convertDigitsToAmount(digits), {
        shouldValidate: true,
        shouldTouch: true,
      });
    },
    [setValue],
  );

  const { inputRef, handleChange: handleCurrencyInput } = useCurrencyInput(
    displayAmount,
    handleAmountChange,
  );

  return {
    amountDigits,
    setAmountDigits,
    displayAmount,
    numericAmount,
    inputRef,
    handleCurrencyInput,
  };
}
