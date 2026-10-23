import {
  addMonths,
  addWeeks,
  addYears,
  differenceInCalendarDays,
  format,
  parseISO,
  isBefore,
  startOfDay,
  type Locale,
} from "date-fns";
import type { TranslationKey } from "@/shared/lib/configs/translations.config";
import {
  RecurringCycle,
  RecurringStatus,
  type RecurringExpense,
  type RecurringSummaryMetrics,
} from "@/shared/lib/types/recurring.type";

/**
 * Normalizes any recurring cycle to monthly cost equivalent.
 * ponytail: Linear standard 52 weeks / 12 months approximation.
 */
export const calculateMonthlyEquivalent = (
  amount: number,
  cycle: RecurringCycle,
): number => {
  if (amount <= 0) return 0;
  switch (cycle) {
    case RecurringCycle.WEEKLY:
      return (amount * 52) / 12;
    case RecurringCycle.MONTHLY:
      return amount;
    case RecurringCycle.QUARTERLY:
      return amount / 3;
    case RecurringCycle.YEARLY:
      return amount / 12;
    default:
      return amount;
  }
};

/**
 * Calculates high-level financial metrics for recurring expenses.
 * Excludes paused or deleted items from monthly/yearly totals.
 */
export const calculateRecurringMetrics = (
  items: RecurringExpense[],
  referenceDate: Date = new Date(),
): RecurringSummaryMetrics => {
  const activeItems = items.filter(
    (item) => item.status === RecurringStatus.ACTIVE,
  );

  const totalMonthly = activeItems.reduce(
    (sum, item) =>
      sum + calculateMonthlyEquivalent(item.amount, item.billingCycle),
    0,
  );

  const totalYearly = totalMonthly * 12;

  // Find nearest upcoming or overdue active item (within 7 days or overdue)
  const today = startOfDay(referenceDate);
  const candidateItems = activeItems
    .map((item) => {
      const date = parseISO(item.nextBillingDate);
      const diff = differenceInCalendarDays(date, today);
      return { item, diff };
    })
    .filter(({ diff }) => diff <= 7) // overdue or due within 7 days
    .sort((a, b) => a.diff - b.diff);

  const upcomingDueItem = candidateItems[0]?.item ?? null;

  return {
    totalMonthly: Math.round(totalMonthly * 100) / 100,
    totalYearly: Math.round(totalYearly * 100) / 100,
    activeCount: activeItems.length,
    upcomingDueItem,
  };
};

export const advanceCycle = (
  dateInput: string | Date,
  cycle: RecurringCycle,
): Date => {
  const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput;
  switch (cycle) {
    case RecurringCycle.WEEKLY:
      return addWeeks(date, 1);
    case RecurringCycle.MONTHLY:
      return addMonths(date, 1);
    case RecurringCycle.QUARTERLY:
      return addMonths(date, 3);
    case RecurringCycle.YEARLY:
      return addYears(date, 1);
    default:
      return addMonths(date, 1);
  }
};

export interface OverdueBillCycle {
  billingDate: string;
  daysOverdue: number;
}

export interface RecurringPendingBillsInfo {
  unpaidCycles: OverdueBillCycle[];
  hasMultipleCycles: boolean;
  currentCycleDate: string;
  oldUnpaidCycles: OverdueBillCycle[];
  totalOverdueCount: number;
}

/**
 * Computes all billing cycles that have arrived on or before referenceDate
 * and detects whether there are older unlogged bills accumulated.
 */
export const getPendingBillsInfo = (
  item: { nextBillingDate: string; billingCycle: RecurringCycle },
  referenceDate: Date = new Date(),
): RecurringPendingBillsInfo => {
  const today = startOfDay(referenceDate);
  const cycle = item.billingCycle;

  const arrivedCycles: OverdueBillCycle[] = [];
  let curr = parseISO(item.nextBillingDate);

  let count = 0;
  while (differenceInCalendarDays(startOfDay(curr), today) <= 0 && count < 52) {
    const daysOverdue = Math.max(
      0,
      differenceInCalendarDays(today, startOfDay(curr)),
    );
    arrivedCycles.push({
      billingDate: curr.toISOString(),
      daysOverdue,
    });
    curr = advanceCycle(curr, cycle);
    count++;
  }

  const hasMultipleCycles = arrivedCycles.length > 1;
  const currentCycleDate =
    arrivedCycles.at(-1)?.billingDate ?? item.nextBillingDate;
  const oldUnpaidCycles =
    arrivedCycles.length > 1 ? arrivedCycles.slice(0, -1) : [];

  return {
    unpaidCycles: arrivedCycles,
    hasMultipleCycles,
    currentCycleDate,
    oldUnpaidCycles,
    totalOverdueCount: arrivedCycles.length,
  };
};

/**
 * Advances the next billing date by its cycle, anchoring to the original scheduled day
 * even if the payment was recorded 2-3 days late or after multiple missed cycles.
 * ponytail: Anchor day advancing prevents billing schedule drift.
 */
export const getNextBillingDate = (
  currentNextBillingDate: string | Date,
  cycle: RecurringCycle,
  fromDate: string | Date = new Date(),
): string => {
  let date =
    typeof currentNextBillingDate === "string"
      ? parseISO(currentNextBillingDate)
      : currentNextBillingDate;

  const targetFloor = startOfDay(
    typeof fromDate === "string" ? parseISO(fromDate) : fromDate,
  );

  // Advance at least once
  date = advanceCycle(date, cycle);

  // If still in the past compared to fromDate, advance until into the future
  while (isBefore(date, targetFloor)) {
    date = advanceCycle(date, cycle);
  }

  return date.toISOString();
};

export interface DueStatus {
  daysRemaining: number;
  isOverdue: boolean;
  label: string;
}

/**
 * Computes overdue / countdown status label for UI cards.
 */
export const getDueStatus = (
  nextBillingDate: string,
  referenceDate: Date = new Date(),
  t?: (key: TranslationKey) => string,
  locale?: Locale,
): DueStatus => {
  const date = parseISO(nextBillingDate);
  const today = startOfDay(referenceDate);
  const diff = differenceInCalendarDays(date, today);

  if (diff < 0) {
    const overdueDays = Math.abs(diff);
    return {
      daysRemaining: diff,
      isOverdue: true,
      label: t
        ? t("recurringDueOverdue").replace("{days}", String(overdueDays))
        : `เลยกำหนด ${overdueDays} วัน`,
    };
  }

  if (diff === 0) {
    return {
      daysRemaining: 0,
      isOverdue: false,
      label: t ? t("recurringDueToday") : "ตัดรอบวันนี้",
    };
  }

  if (diff === 1) {
    return {
      daysRemaining: 1,
      isOverdue: false,
      label: t ? t("recurringDueTomorrow") : "ตัดรอบพรุ่งนี้",
    };
  }

  if (diff <= 7) {
    return {
      daysRemaining: diff,
      isOverdue: false,
      label: t
        ? t("recurringDueInDays").replace("{days}", String(diff))
        : `ตัดรอบในอีก ${diff} วัน`,
    };
  }

  return {
    daysRemaining: diff,
    isOverdue: false,
    label: t
      ? format(date, "d MMM yyyy", { locale })
      : `ตัดรอบ ${format(date, "d MMM yyyy")}`,
  };
};

/**
 * Default sorting: Soonest next billing date (including overdue) first.
 */
export const sortRecurringExpenses = (
  items: RecurringExpense[],
): RecurringExpense[] => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.nextBillingDate).getTime();
    const dateB = new Date(b.nextBillingDate).getTime();
    return dateA - dateB;
  });
};
