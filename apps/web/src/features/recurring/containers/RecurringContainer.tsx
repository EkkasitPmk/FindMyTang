"use client";
import { useState, useMemo } from "react";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import ConfirmModal from "@/shared/components/customs/ConfirmModal";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  useRecurringExpensesQuery,
  useUpdateRecurringExpenseMutation,
  useDeleteRecurringExpenseMutation,
} from "../hooks/useRecurring.hook";
import {
  useRecurringSheetStore,
  useRecurringLogModalStore,
} from "../hooks/recurring-sheet.hook";
import {
  RecurringExpense,
  RecurringStatus,
} from "@/shared/lib/types/recurring.type";
import {
  calculateRecurringMetrics,
  sortRecurringExpenses,
} from "../helpers/recurring.helper";
import RecurringSummaryCard from "../components/RecurringSummaryCard";
import RecurringUpcomingAlert from "../components/RecurringUpcomingAlert";
import RecurringFilterChips from "../components/RecurringFilterChips";
import type { RecurringFilterType } from "../types/recurring.type";
import RecurringItemCard from "../components/RecurringItemCard";
import RecurringEmptyState from "../components/RecurringEmptyState";
import RecurringFormSheet from "../components/RecurringFormSheet";
import RecurringLogModal from "../components/RecurringLogModal";
import { RecurringCardSkeleton } from "../components/RecurringPageSkeleton";

interface RecurringContainerProps {
  initialItems?: RecurringExpense[];
}

export default function RecurringContainer({
  initialItems,
}: Readonly<RecurringContainerProps> = {}) {
  const { t } = useTranslation();

  const { data: recurringList = [], isPending } = useRecurringExpensesQuery(
    undefined,
    { initialData: initialItems },
  );
  const updateMutation = useUpdateRecurringExpenseMutation();
  const deleteMutation = useDeleteRecurringExpenseMutation();

  const openSheet = useRecurringSheetStore((state) => state.open);
  const openLog = useRecurringLogModalStore((state) => state.open);

  const [currentFilter, setCurrentFilter] =
    useState<RecurringFilterType>("ALL");
  const [itemToDelete, setItemToDelete] = useState<RecurringExpense | null>(
    null,
  );

  const metrics = useMemo(
    () => calculateRecurringMetrics(recurringList),
    [recurringList],
  );

  const filteredItems = useMemo(() => {
    let items = recurringList;
    if (currentFilter === RecurringStatus.ACTIVE) {
      items = items.filter((i) => i.status === RecurringStatus.ACTIVE);
    } else if (currentFilter === RecurringStatus.PAUSED) {
      items = items.filter((i) => i.status === RecurringStatus.PAUSED);
    }
    return sortRecurringExpenses(items);
  }, [recurringList, currentFilter]);

  const handleToggleStatus = (item: RecurringExpense) => {
    const newStatus =
      item.status === RecurringStatus.ACTIVE
        ? RecurringStatus.PAUSED
        : RecurringStatus.ACTIVE;

    updateMutation.mutate(
      { id: item.id, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success(
            newStatus === RecurringStatus.PAUSED
              ? t("recurringPausedSuccess")
              : t("recurringResumedSuccess"),
          );
        },
        onError: () => {
          toast.error(t("recurringStatusError"));
        },
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    deleteMutation.mutate(itemToDelete.id, {
      onSuccess: () => {
        toast.success(t("recurringDeletedSuccess"));
        setItemToDelete(null);
      },
      onError: () => {
        toast.error(t("recurringDeleteError"));
      },
    });
  };

  const renderMainContent = () => {
    if (isPending) {
      return (
        <div className="space-y-3 pt-2">
          {[1, 2, 3].map((n) => (
            <RecurringCardSkeleton key={n} />
          ))}
        </div>
      );
    }

    if (recurringList.length === 0) {
      return <RecurringEmptyState />;
    }

    return (
      <>
        {/* Filter Chips */}
        <RecurringFilterChips
          currentFilter={currentFilter}
          onChange={setCurrentFilter}
          items={recurringList}
        />

        {/* Subscriptions List */}
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <RecurringItemCard
              key={item.id}
              item={item}
              onEdit={(it) => openSheet(it)}
              onToggleStatus={handleToggleStatus}
              onDelete={(it) => setItemToDelete(it)}
              onLogExpense={(it, targetBillingDate) =>
                openLog(it, targetBillingDate)
              }
            />
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-xs text-muted-foreground">
              {t("recurringNoItemsFilter")}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="mx-auto px-4 py-4 md:pt-0 space-y-4">
        {/* Summary Card */}
        <RecurringSummaryCard metrics={metrics} />

        {/* Upcoming or Overdue Alert */}
        <RecurringUpcomingAlert item={metrics.upcomingDueItem} />

        {/* Main Content (Loading Skeleton, Empty State, or Items List) */}
        {renderMainContent()}
      </div>

      {/* Sheet & Modal Containers */}
      <RecurringFormSheet />
      <RecurringLogModal />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        icon={Trash2}
        title={t("recurringDeleteConfirm")}
        des={itemToDelete?.name || ""}
        confirmLabel={t("delete")}
        cancelLabel={t("cancel")}
        variant="danger"
      />
    </>
  );
}
