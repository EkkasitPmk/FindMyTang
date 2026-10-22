"use client";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { RecurringExpense } from "@/shared/lib/types/recurring.type";
import { getDueStatus } from "../helpers/recurring.helper";
import { AlertCircle, ChevronRight, Plus } from "lucide-react";
import { useRecurringLogModalStore } from "../hooks/recurring-sheet.hook";

interface RecurringUpcomingAlertProps {
  item: RecurringExpense | null;
}

export default function RecurringUpcomingAlert({
  item,
}: Readonly<RecurringUpcomingAlertProps>) {
  const { t, locale } = useTranslation();
  const openLog = useRecurringLogModalStore((state) => state.open);

  if (!item) return null;

  const dueStatus = getDueStatus(item.nextBillingDate);
  const formattedAmount = `฿${item.amount.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  let alertMessage = "";
  if (dueStatus.isOverdue) {
    const overdueDays = Math.abs(dueStatus.daysRemaining);
    alertMessage = t("recurringOverdueAlert")
      .replace("{name}", item.name)
      .replace("{days}", String(overdueDays))
      .replace("{amount}", formattedAmount);
  } else if (dueStatus.daysRemaining === 0) {
    alertMessage = t("recurringUpcomingAlertToday")
      .replace("{name}", item.name)
      .replace("{amount}", formattedAmount);
  } else {
    alertMessage = t("recurringUpcomingAlert")
      .replace("{name}", item.name)
      .replace("{days}", String(dueStatus.daysRemaining))
      .replace("{amount}", formattedAmount);
  }

  const isOverdue = dueStatus.isOverdue;

  return (
    <button
      type="button"
      onClick={() => openLog(item)}
      className={`w-full text-left rounded-xl p-3 border transition-colors cursor-pointer ${
        isOverdue
          ? "bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200 hover:bg-rose-500/15"
          : "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200 hover:bg-amber-500/15"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <AlertCircle
            className={`size-4 shrink-0 mt-0.5 ${
              isOverdue
                ? "text-rose-600 dark:text-rose-400"
                : "text-amber-600 dark:text-amber-400"
            }`}
          />
          <p className="text-xs font-medium leading-relaxed wrap-break-word">
            {alertMessage}
          </p>
        </div>
        <div
          className={`flex items-center gap-1 shrink-0 text-xs font-semibold self-end sm:self-auto ${
            isOverdue
              ? "text-rose-600 dark:text-rose-400"
              : "text-amber-600 dark:text-amber-400"
          }`}
        >
          <Plus className="size-3.5" />
          <span>{t("recurringLogExpense")}</span>
          <ChevronRight className="size-3.5 opacity-80" />
        </div>
      </div>
    </button>
  );
}
