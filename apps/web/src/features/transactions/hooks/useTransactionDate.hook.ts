import { useMemo, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";
import { updatePresetDate } from "@/shared/lib/helpers/date.helper";
import type { CreateTransactionFormValues } from "../schemas/transaction.form.schema";

export function useTransactionDate(
  date: Date,
  setValue: UseFormSetValue<CreateTransactionFormValues>,
) {
  const currentMonth = useMemo(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    [],
  );
  const [displayMonth, setDisplayMonth] = useState<Date | undefined>(
    currentMonth,
  );
  const [tempDate, setTempDate] = useState<Date | undefined>(date);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [hasPendingDateSelection, setHasPendingDateSelection] = useState(false);

  const hasUnconfirmedDateSelection = Boolean(
    hasPendingDateSelection &&
    tempDate &&
    tempDate.getTime() !== date.getTime(),
  );

  const handleOpenCalendar = () => {
    setTempDate(date);
    setDisplayMonth(date);
    setHasPendingDateSelection(false);
  };

  const handleConfirmDate = () => {
    if (tempDate) {
      setValue("transactionDate", tempDate.toISOString(), {
        shouldValidate: true,
      });
    }
    setIsCalendarOpen(false);
    setHasPendingDateSelection(false);
  };

  const handleSelectDate = (newDate: Date | undefined) => {
    setTempDate(newDate);
    setHasPendingDateSelection(newDate?.getTime() !== date.getTime());
  };

  const handlePresetClick = (daysToAdd: number) => {
    const newDate = updatePresetDate(daysToAdd, tempDate);
    setTempDate(newDate);
    setDisplayMonth(newDate);
    setHasPendingDateSelection(newDate.getTime() !== date.getTime());
  };

  return {
    displayMonth,
    setDisplayMonth,
    tempDate,
    handleSelectDate,
    isCalendarOpen,
    setIsCalendarOpen,
    hasUnconfirmedDateSelection,
    handleOpenCalendar,
    handleConfirmDate,
    handlePresetClick,
  };
}
