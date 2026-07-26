import { TransactionResponse } from "@/shared/lib/types/transaction.type";

export const calculateNetTotal = (items: TransactionResponse[]) => {
  return items.reduce((acc, transaction) => {
    if (transaction.type === "INCOME") return acc + transaction.amount;
    if (transaction.type === "EXPENSE") return acc - transaction.amount;
    if (transaction.type === "ADJUSTMENT") return acc + transaction.amount;
    if (transaction.type === "TRANSFER") return acc - transaction.amount;
    return acc;
  }, 0);
};

const getFutureWeekText = (weeks: number, t: (key: string) => string) => {
  const futureKeys: Record<number, string> = {
    1: "in1Week",
    2: "in2Weeks",
    3: "in3Weeks",
  };
  return futureKeys[weeks]
    ? t(futureKeys[weeks])
    : t("inWeeks").replace("{weeks}", weeks.toString());
};

const getPastWeekText = (weeks: number, t: (key: string) => string) => {
  return weeks === 1
    ? t("oneWeekAgo")
    : t("weeksAgo").replace("{weeks}", weeks.toString());
};

const getFutureDayText = (days: number, t: (key: string) => string) => {
  const futureKeys: Record<number, string> = { 2: "in2Days", 3: "in3Days" };
  return futureKeys[days]
    ? t(futureKeys[days])
    : t("inDays").replace("{days}", days.toString());
};

const getPastDayText = (days: number, t: (key: string) => string) => {
  return t("daysAgo").replace("{days}", days.toString());
};

export const getTopRowText = (
  diffDays: number | null,
  t: (key: string) => string,
) => {
  if (diffDays === null) return "";

  const exactMatches: Record<string, string> = {
    "0": "today",
    "-1": "yesterday",
    "1": "tomorrow",
  };

  if (diffDays.toString() in exactMatches) {
    return t(exactMatches[diffDays.toString()]);
  }

  const absDays = Math.abs(diffDays);

  if (absDays % 7 === 0) {
    const weeks = absDays / 7;
    return diffDays > 0
      ? getFutureWeekText(weeks, t)
      : getPastWeekText(weeks, t);
  }

  return diffDays > 0
    ? getFutureDayText(absDays, t)
    : getPastDayText(absDays, t);
};

export const getNetTotalConfig = (netTotal: number) => {
  if (netTotal > 0) return { colorClass: "text-income", prefix: "+" };
  if (netTotal < 0) return { colorClass: "text-expense", prefix: "-" };
  return { colorClass: "text-secondary-text", prefix: "" };
};
