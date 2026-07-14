import { useState, useRef, useCallback, useMemo } from "react";
import { addMonths, subMonths, setMonth, setYear, format } from "date-fns";
import { useClickOutside } from "@/shared/lib/hooks/useClickOutside.hook";
import { MONTHS } from "@/shared/lib/configs/date.config";
import { useTransactionYearsQuery } from "@/features/transactions/hooks/transaction.hook";

export function useJournalCalendar(initialDate: Date = new Date()) {
  const [currentMonth, setCurrentMonth] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Navigator UI State
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  useClickOutside(monthRef, () => setIsMonthOpen(false), isMonthOpen);
  useClickOutside(yearRef, () => setIsYearOpen(false), isYearOpen);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  }, []);

  const handleMonthSelect = useCallback((monthIndex: number) => {
    setCurrentMonth((prev) => setMonth(prev, monthIndex));
    setIsMonthOpen(false);
  }, []);

  const handleYearSelect = useCallback((year: number) => {
    setCurrentMonth((prev) => setYear(prev, year));
    setIsYearOpen(false);
  }, []);

  const handleMonthToggle = useCallback(() => {
    setIsMonthOpen((prev) => !prev);
    setIsYearOpen(false);
  }, []);

  const handleYearToggle = useCallback(() => {
    setIsYearOpen((prev) => !prev);
    setIsMonthOpen(false);
  }, []);

  const handleGoToToday = useCallback(() => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date()); // also select today's date if you want, or just jump month
  }, []);

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const { data: availableYears } = useTransactionYearsQuery();

  const years = useMemo(() => {
    if (availableYears && availableYears.length > 0) {
      return availableYears;
    }
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 7 }, (_, i) => currentYear - 5 + i).reverse();
  }, [availableYears]);

  return {
    currentMonth,
    selectedDate,
    navigatorProps: {
      currentMonth,
      isMonthOpen,
      isYearOpen,
      monthRef,
      yearRef,
      monthLabel: format(currentMonth, "MMMM").toUpperCase(),
      yearLabel: format(currentMonth, "yyyy"),
      selectedMonthIndex: currentMonth.getMonth(),
      selectedYear: currentMonth.getFullYear(),
      months: MONTHS,
      years,
      onMonthToggle: handleMonthToggle,
      onYearToggle: handleYearToggle,
      onMonthSelect: handleMonthSelect,
      onYearSelect: handleYearSelect,
      onPrevMonth: handlePrevMonth,
      onNextMonth: handleNextMonth,
      onGoToToday: handleGoToToday,
    },
    handleSelectDate,
  };
}
