import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";

import { TransactionResponse } from "@/features/transactions/types/transaction.type";

export interface DailySummary {
  income: number;
  expense: number;
  transfer: number;
  adjustment: number;
  net: number;
}

// MonthlySummary is aliased to DailySummary later

export interface CalendarDay {
  date: Date;
  dateKey: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  summary?: DailySummary;
  contributionBgClass: string;
}

/**
 * แปลงตัวเลขเงินให้ย่อสำหรับแสดงใน calendar cell
 * - < 10,000: แสดงเต็มพร้อม 2 ทศนิยม (เช่น 300.00, 1,234.56)
 * - >= 10,000 และ < 1,000,000: ใช้ K (เช่น 10K, 150.5K)
 * - >= 1,000,000: ใช้ M (เช่น 1.5M, 2M)
 */
export function formatCompactAmount(
  amount: number,
  locale: string = "en-US",
): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  if (abs < 10_000) {
    return (
      sign +
      abs.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  if (abs < 1_000_000) {
    const k = abs / 1_000;
    const formatted = k % 1 === 0 ? k.toFixed(0) : k.toFixed(1);
    return `${sign}${formatted}K`;
  }

  const m = abs / 1_000_000;
  const formatted = m % 1 === 0 ? m.toFixed(0) : m.toFixed(1);
  return `${sign}${formatted}M`;
}

/**
 * จัดกลุ่ม transactions ตามวันที่ (key = yyyy-MM-dd)
 */
export function groupTransactionsByDate(
  transactions: TransactionResponse[],
): Map<string, TransactionResponse[]> {
  const map = new Map<string, TransactionResponse[]>();

  for (const tx of transactions) {
    const key = format(new Date(tx.transactionDate), "yyyy-MM-dd");
    const group = map.get(key);

    if (group) {
      group.push(tx);
    } else {
      map.set(key, [tx]);
    }
  }

  return map;
}

/**
 * คำนวณสรุปยอดรายวันจาก transactions ของวันเดียว
 */
export function calculateDailySummary(
  transactions: TransactionResponse[],
): DailySummary {
  let income = 0;
  let expense = 0;
  let transfer = 0;
  let adjustment = 0;

  for (const tx of transactions) {
    switch (tx.type) {
      case "INCOME":
        income += tx.amount;
        break;
      case "EXPENSE":
        expense += tx.amount;
        break;
      case "TRANSFER":
        transfer += tx.amount;
        break;
      case "ADJUSTMENT":
        adjustment += tx.amount;
        break;
    }
  }

  return {
    income,
    expense,
    transfer,
    adjustment,
    net: income - expense,
  };
}

export type MonthlySummary = DailySummary;

/**
 * คำนวณสรุปยอดรายเดือนจาก transactions ทั้งเดือน
 */
export function calculateMonthlySummary(
  transactions: TransactionResponse[],
): MonthlySummary {
  return calculateDailySummary(transactions);
}

/**
 * คืนค่าระดับ 0-4 สำหรับ GitHub contribution style coloring
 * - 0: ไม่มี transaction (net = 0 หรือ maxAbsNet = 0)
 * - 1-4: ระดับความเข้มตาม ratio ของ |net| / maxAbsNet
 */
export function getContributionLevel(net: number, maxAbsNet: number): number {
  if (net === 0 || maxAbsNet === 0) return 0;

  const ratio = Math.abs(net) / maxAbsNet;

  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

/**
 * คำนวณจำนวนสัปดาห์และวันที่ในปฏิทินของเดือนนั้นๆ พร้อมข้อมูลสำหรับแสดงผล
 */
export function generateCalendarWeeks(
  currentMonth: Date,
  selectedDate: Date | null,
  dailySummaries: Map<string, DailySummary>,
  maxAbsNet: number,
): CalendarDay[][] {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: calStart, end: calEnd });

  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    const weekDays = calendarDays.slice(i, i + 7).map((day) => {
      const dateKey = format(day, "yyyy-MM-dd");
      const isCurrentMonth = isSameMonth(day, currentMonth);
      const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
      const isTodayDate = isToday(day);
      const summary = dailySummaries.get(dateKey);
      const contributionBgClass = isCurrentMonth
        ? getContributionBgClass(summary, maxAbsNet)
        : "";

      return {
        date: day,
        dateKey,
        dayOfMonth: day.getDate(),
        isCurrentMonth,
        isSelected,
        isToday: isTodayDate,
        summary,
        contributionBgClass,
      };
    });
    weeks.push(weekDays);
  }

  return weeks;
}

/**
 * หาค่า Net (absolute) ที่มากที่สุดจากสรุปรายวันทั้งหมดในเดือนนั้น
 */
export function getMaxAbsNet(
  dailySummaries: Map<string, DailySummary>,
): number {
  let max = 0;
  dailySummaries.forEach((summary) => {
    const absNet = Math.abs(summary.net);
    if (absNet > max) max = absNet;
  });
  return max;
}

/**
 * คำนวณหา Class Name สำหรับสีพื้นหลังของแต่ละวัน (Contribution Style)
 */
export function getContributionBgClass(
  summary: DailySummary | undefined,
  maxAbsNet: number,
): string {
  if (!summary || summary.net === 0) return "";

  const level = getContributionLevel(summary.net, maxAbsNet);

  const incomeClasses = [
    "",
    "bg-income-light/30",
    "bg-income-light/50",
    "bg-income-light/70",
    "bg-income-light",
  ];

  const expenseClasses = [
    "",
    "bg-expense-light/30",
    "bg-expense-light/50",
    "bg-expense-light/70",
    "bg-expense-light",
  ];

  return summary.net > 0 ? incomeClasses[level] : expenseClasses[level];
}

export function formatAmount(value: number, locale: string = "en-US"): string {
  return `฿${Math.abs(value).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatNet(value: number, locale: string = "en-US"): string {
  const sign = value >= 0 ? "+" : "-";
  return `${sign}฿${Math.abs(value).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
