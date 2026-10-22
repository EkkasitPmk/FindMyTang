"use client";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { useRecurringSheetStore } from "../hooks/recurring-sheet.hook";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { Repeat, Plus } from "lucide-react";

export default function RecurringEmptyState() {
  const { t } = useTranslation();
  const openSheet = useRecurringSheetStore((state) => state.open);

  return (
    <div className="py-8 px-4 flex flex-col items-center justify-center text-center">
      <div className="size-16 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-4 shadow-xs">
        <Repeat className="size-8" />
      </div>

      <h3 className="text-base font-semibold text-foreground mb-1">
        {t("recurringEmptyTitle")}
      </h3>
      <p className="text-xs text-muted-foreground max-w-xs mb-6">
        {t("recurringEmptyDesc")}
      </p>

      <Button
        type="button"
        size="lg"
        onClick={() => openSheet()}
        className="rounded-xl shadow-xs gap-1"
        leftIcon={<Plus className="size-4" />}
      >
        {t("recurringAddFirst")}
      </Button>
    </div>
  );
}
