import { TranslationKey } from "@/shared/lib/configs/translations.config";

export function getDiffDays(date: Date | undefined): number | null {
  if (!date) return null;
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const startOfSelected = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const diffTime = startOfSelected.getTime() - startOfToday.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

const getExactDayText = (
  diffDays: number,
  t?: (key: TranslationKey) => string,
): string | null => {
  const matches: Record<string, { key: TranslationKey; fallback: string }> = {
    "0": { key: "today", fallback: "Today" },
    "-1": { key: "yesterday", fallback: "Yesterday" },
    "1": { key: "tomorrow", fallback: "Tomorrow" },
  };
  const match = matches[diffDays.toString()];
  if (!match) return null;
  return t ? t(match.key) : match.fallback;
};

const getWeekPrefix = (
  diffDays: number,
  t?: (key: TranslationKey) => string,
): string => {
  const weeks = Math.abs(diffDays) / 7;
  const suffix = weeks > 1 ? "s" : "";
  if (t) {
    return diffDays > 0
      ? t("inWeeks").replace("{weeks}", String(weeks))
      : t("weeksAgo").replace("{weeks}", String(weeks));
  }
  return diffDays > 0
    ? `In ${weeks} week${suffix}`
    : `${weeks} week${suffix} ago`;
};

const getDayPrefix = (
  diffDays: number,
  t?: (key: TranslationKey) => string,
): string => {
  const days = Math.abs(diffDays);
  if (t) {
    return diffDays > 0
      ? t("inDays").replace("{days}", String(days))
      : t("daysAgo").replace("{days}", String(days));
  }
  return diffDays > 0 ? `In ${days} days` : `${days} days ago`;
};

const getPrefix = (
  diffDays: number,
  t?: (key: TranslationKey) => string,
): string => {
  const exactText = getExactDayText(diffDays, t);
  if (exactText) return exactText;

  if (diffDays % 7 === 0) return getWeekPrefix(diffDays, t);

  return getDayPrefix(diffDays, t);
};

export function formatDisplayDate(
  date: Date | undefined,
  includeTime: boolean = false,
  locale: string = "en-US",
  t?: (key: TranslationKey) => string,
): string {
  const diffDays = getDiffDays(date);
  if (diffDays === null || !date) return "";

  const prefix = getPrefix(diffDays, t);

  const dateStr = `${String(date.getDate()).padStart(2, "0")} ${date.toLocaleString(locale, { month: "short" })} ${locale === "th-TH" ? String(date.getFullYear() + 543).slice(-2) : String(date.getFullYear()).slice(-2)}`;
  const displayStr = prefix ? `${prefix}, ${dateStr}` : dateStr;

  if (includeTime) {
    const timeStr = date.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${displayStr} ${timeStr}`;
  }

  return displayStr;
}

export function updatePresetDate(daysToAdd: number, baseDate?: Date): Date {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + daysToAdd);
  if (baseDate) {
    newDate.setHours(baseDate.getHours(), baseDate.getMinutes(), 0, 0);
  }
  return newDate;
}
