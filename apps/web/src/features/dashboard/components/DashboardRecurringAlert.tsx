"use client";
import { useRecurringExpensesQuery } from "@/features/recurring/hooks/useRecurring.hook";
import { calculateRecurringMetrics } from "@/features/recurring/helpers/recurring.helper";
import RecurringUpcomingAlert from "@/features/recurring/components/RecurringUpcomingAlert";
import RecurringLogModal from "@/features/recurring/components/RecurringLogModal";
import type { RecurringExpense } from "@/shared/lib/types/recurring.type";

interface DashboardRecurringAlertProps {
  initialItems?: RecurringExpense[];
}

export default function DashboardRecurringAlert({
  initialItems,
}: Readonly<DashboardRecurringAlertProps> = {}) {
  const { data: items = [] } = useRecurringExpensesQuery(undefined, {
    initialData: initialItems,
  });

  const metrics = calculateRecurringMetrics(items);

  if (!metrics.upcomingDueItem) return null;

  return (
    <div className="px-4">
      <RecurringUpcomingAlert item={metrics.upcomingDueItem} />
      <RecurringLogModal />
    </div>
  );
}
