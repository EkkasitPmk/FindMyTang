"use client";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { RecurringExpense } from "@/shared/lib/types/recurring.type";
import { getDueStatus } from "../helpers/recurring.helper";
import { AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
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

  let dueBadgeColor =
    "bg-muted text-muted-foreground border-border/40 hover:bg-muted/60";
  if (dueStatus.isOverdue) {
    dueBadgeColor =
      "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/15";
  } else if (dueStatus.daysRemaining <= 3) {
    dueBadgeColor =
      "bg-amber-500/10 border-amber-500/30 text-amber-300 dark:text-amber-400 hover:bg-amber-500/15";
  }

  return (
    <Button
      variant="unstyled"
      hoverScale={1.01}
      tapScale={0.99}
      type="button"
      onClick={() => openLog(item)}
      className={`w-full text-left rounded-xl p-3 border transition-colors cursor-pointer ${dueBadgeColor}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <AlertCircle className="size-4 shrink-0" />
        <p className="text-xs font-medium leading-relaxed wrap-break-word">
          {alertMessage}
        </p>
      </div>
    </Button>
  );
}
