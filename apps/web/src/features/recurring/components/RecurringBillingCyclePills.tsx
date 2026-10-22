"use client";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { cn } from "@/shared/lib/utils/core.util";
import { RecurringCycle } from "@/shared/lib/types/recurring.type";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

interface RecurringBillingCyclePillsProps {
  value: RecurringCycle;
  onChange: (cycle: RecurringCycle) => void;
  label?: string;
}

export function RecurringBillingCyclePills({
  value,
  onChange,
  label,
}: Readonly<RecurringBillingCyclePillsProps>) {
  const { t } = useTranslation();

  const billingCycles = [
    { value: RecurringCycle.WEEKLY, label: t("recurringCycleWeekly") },
    { value: RecurringCycle.MONTHLY, label: t("recurringCycleMonthly") },
    { value: RecurringCycle.QUARTERLY, label: t("recurringCycleQuarterly") },
    { value: RecurringCycle.YEARLY, label: t("recurringCycleYearly") },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-secondary-text">
        {label ?? t("recurringCycleLabel")} *
      </label>
      <div className="grid grid-cols-4 gap-1 p-1 bg-surface-secondary/50 rounded-lg border border-border">
        {billingCycles.map((cycle) => (
          <Button
            variant="unstyled"
            key={cycle.value}
            type="button"
            onClick={() => onChange(cycle.value)}
            className={cn(
              "py-2 text-xs font-semibold rounded-md transition-all cursor-pointer text-center",
              value === cycle.value
                ? "bg-primary text-white shadow-xs"
                : "text-secondary-text hover:text-primary-text hover:bg-surface/50",
            )}
          >
            {cycle.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
