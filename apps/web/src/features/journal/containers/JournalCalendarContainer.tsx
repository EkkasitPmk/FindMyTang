"use client";
import { useMemo, useRef, useCallback } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  format,
} from "date-fns";
import { useTransactionsQuery } from "@/features/transactions/hooks/transaction.hook";
import { TransactionListContainer } from "@/features/transactions/containers/TransactionListContainer";
import {
  GroupedTransaction,
  TransactionResponse,
} from "@/shared/lib/types/transaction.type";
import MonthYearNavigator from "../components/MonthYearNavigator";
import JournalCalendarGrid from "../components/JournalCalendarGrid";
import { TransactionSummary } from "@/shared/components/customs/TransactionSummary";
import {
  groupTransactionsByDate,
  calculateDailySummary,
  calculateMonthlySummary,
  generateCalendarWeeks,
  getMaxAbsNet,
  type DailySummary,
} from "../helpers/calendar.helper";
import { useJournalCalendar } from "../hooks/journal-calendar.hook";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

export default function JournalCalendarContainer() {
  const { locale } = useTranslation();
  const { currentMonth, selectedDate, navigatorProps, handleSelectDate } =
    useJournalCalendar(locale);

  const transactionListRef = useRef<HTMLDivElement>(null);

  // fetch transactions for the entire calendar grid (including outside days)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const { data: transactionsData, isLoading: isLoadingTransactions } =
    useTransactionsQuery({
      from: calStart.toISOString(),
      to: calEnd.toISOString(),
      limit: 1000,
      sortType: "DATE_NEWEST",
    });

  const allTransactions = useMemo(
    () => transactionsData?.items ?? [],
    [transactionsData],
  );

  // Group by date for calendar cells
  const transactionsByDate = useMemo(
    () => groupTransactionsByDate(allTransactions),
    [allTransactions],
  );

  // Daily summaries for calendar grid
  const dailySummaries = useMemo(() => {
    const map = new Map<string, DailySummary>();
    transactionsByDate.forEach((txs, dateKey) => {
      map.set(dateKey, calculateDailySummary(txs));
    });
    return map;
  }, [transactionsByDate]);

  // Derived calendar data
  const maxAbsNet = useMemo(
    () => getMaxAbsNet(dailySummaries),
    [dailySummaries],
  );
  const weeks = useMemo(
    () =>
      generateCalendarWeeks(
        currentMonth,
        selectedDate,
        dailySummaries,
        maxAbsNet,
      ),
    [currentMonth, selectedDate, dailySummaries, maxAbsNet],
  );

  const currentMonthTransactions = useMemo(
    () =>
      allTransactions.filter((tx: TransactionResponse) =>
        isSameMonth(new Date(tx.transactionDate), currentMonth),
      ),
    [allTransactions, currentMonth],
  );

  // Monthly summary (only for current month)
  const monthlySummary = useMemo(
    () => calculateMonthlySummary(currentMonthTransactions),
    [currentMonthTransactions],
  );

  // Group for TransactionListContainer (date label grouped)
  const groupedTransactions: GroupedTransaction[] = useMemo(() => {
    const groups: GroupedTransaction[] = [];
    // Sort dates newest first
    const sortedKeys = Array.from(transactionsByDate.keys()).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
    );
    sortedKeys.forEach((dateKey) => {
      // Only include transactions that belong to the current month in the list
      if (isSameMonth(new Date(dateKey), currentMonth)) {
        const items = transactionsByDate.get(dateKey)!;
        const dateStr = Intl.DateTimeFormat(locale, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date(dateKey));
        groups.push({ dateStr, items });
      }
    });
    return groups;
  }, [transactionsByDate, currentMonth, locale]);

  // Click on a date in the calendar -> scroll to that date's group
  const handleDateClick = useCallback(
    (date: Date) => {
      handleSelectDate(date);
      const dateKey = format(date, "yyyy-MM-dd");
      const hasTransactions = transactionsByDate.has(dateKey);

      if (!hasTransactions) return;

      // Scroll into view within Section 4
      requestAnimationFrame(() => {
        const container = transactionListRef.current;
        if (!container) return;
        const dateStr = Intl.DateTimeFormat(locale, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(date);
        const target = container.querySelector(
          `[data-date-group="${dateStr}"]`,
        );
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    },
    [handleSelectDate, transactionsByDate, locale],
  );

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="space-y-1 shrink-0">
        {/* Section 1: Month/Year Navigator */}
        <MonthYearNavigator {...navigatorProps} />

        {/* Section 2: Calendar Grid */}
        <JournalCalendarGrid weeks={weeks} onSelectDate={handleDateClick} />
      </div>

      <div
        ref={transactionListRef}
        className="flex-1 overflow-y-auto relative min-h-0 pb-4"
      >
        {/* Section 3: Monthly Summary */}
        <div className="mb-1 shrink-0">
          <TransactionSummary
            income={monthlySummary.income}
            expense={monthlySummary.expense}
            transfer={monthlySummary.transfer}
            adjustment={monthlySummary.adjustment}
            net={monthlySummary.net}
          />
        </div>

        {/* Section 4: Transaction List — Scrollable only here */}
        <TransactionListContainer
          groupedTransactions={groupedTransactions}
          isLoadingTransactions={isLoadingTransactions}
          page="journal"
        />
      </div>
    </div>
  );
}
