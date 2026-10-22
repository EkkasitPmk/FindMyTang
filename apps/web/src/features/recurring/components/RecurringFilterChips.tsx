"use client";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import {
  RecurringExpense,
  RecurringStatus,
} from "@/shared/lib/types/recurring.type";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import type { RecurringFilterType } from "../types/recurring.type";

interface RecurringFilterChipsProps {
  currentFilter: RecurringFilterType;
  onChange: (filter: RecurringFilterType) => void;
  items: RecurringExpense[];
}

export default function RecurringFilterChips({
  currentFilter,
  onChange,
  items,
}: Readonly<RecurringFilterChipsProps>) {
  const { t } = useTranslation();

  const allCount = items.length;
  const activeCount = items.filter(
    (item) => item.status === RecurringStatus.ACTIVE,
  ).length;
  const pausedCount = items.filter(
    (item) => item.status === RecurringStatus.PAUSED,
  ).length;

  const filters: { id: RecurringFilterType; label: string; count: number }[] = [
    {
      id: "ALL",
      label: t("recurringFilterAll"),
      count: allCount,
    },
    {
      id: RecurringStatus.ACTIVE,
      label: t("recurringFilterActive"),
      count: activeCount,
    },
    {
      id: RecurringStatus.PAUSED,
      label: t("recurringFilterPaused"),
      count: pausedCount,
    },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
      {filters.map((filter) => {
        const isActive = currentFilter === filter.id;
        return (
          <Button
            key={filter.id}
            type="button"
            size="sm"
            variant={isActive ? "default" : "secondary"}
            onClick={() => onChange(filter.id)}
            className="rounded-full shadow-xs shrink-0"
            rightIcon={
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? "bg-background/20 text-background"
                    : "bg-muted-foreground/15 text-muted-foreground"
                }`}
              >
                {filter.count}
              </span>
            }
          >
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
}
