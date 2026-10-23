"use client";
import { useState } from "react";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/animate-ui/components/radix/dialog";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { useRecurringLogModalStore } from "../hooks/recurring-sheet.hook";
import { useLogRecurringExpenseMutation } from "../hooks/useRecurring.hook";
import { advanceCycle } from "../helpers/recurring.helper";
import { format, parseISO } from "date-fns";
import { th, enUS } from "date-fns/locale";
import { toast } from "react-toastify";
import { CheckCircle2 } from "lucide-react";
import { RecurringExpense } from "@/shared/lib/types/recurring.type";
import TransactionAssetList from "@/features/transactions/components/TransactionAssetList";
import TransactionDescriptionField from "@/features/transactions/components/TransactionDescriptionField";
import { RecurringDatePicker } from "./RecurringDatePicker";
import { RecurringAmountField } from "./RecurringAmountField";

interface RecurringLogFormProps {
  itemToLog: RecurringExpense;
  targetBillingDate?: string;
  close: () => void;
}

function RecurringLogForm({
  itemToLog,
  targetBillingDate,
  close,
}: Readonly<RecurringLogFormProps>) {
  const { t, currentLanguage, locale } = useTranslation();
  const calendarLocale = currentLanguage === "th" ? th : enUS;
  const { data: assets = [] } = useAssets();
  const logMutation = useLogRecurringExpenseMutation();

  const targetDate = targetBillingDate || itemToLog.nextBillingDate;
  const [amount, setAmount] = useState<number | "">(itemToLog.amount);
  const [paymentDate, setPaymentDate] = useState<Date>(() =>
    targetBillingDate ? parseISO(targetBillingDate) : new Date(),
  );
  const [assetId, setAssetId] = useState<string>(itemToLog.assetId || "");
  const selectedAssetId =
    assetId || itemToLog.assetId || (assets.length > 0 ? assets[0].id : "");
  const [note, setNote] = useState<string>(itemToLog.note || "");

  const nextDate = advanceCycle(
    targetDate,
    itemToLog.billingCycle,
  ).toISOString();

  let nextDateFormatted = "";
  try {
    nextDateFormatted = format(parseISO(nextDate), "d MMM yyyy", {
      locale: calendarLocale,
    });
  } catch {
    nextDateFormatted = nextDate;
  }

  let cycleFormattedDate = "";
  try {
    cycleFormattedDate = format(parseISO(targetDate), "d MMM yyyy", {
      locale: calendarLocale,
    });
  } catch {
    cycleFormattedDate = targetDate;
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const effectiveAssetId = selectedAssetId;

    logMutation.mutate(
      {
        item: itemToLog,
        payload: {
          amount: Number(amount),
          paymentDate: paymentDate.toISOString(),
          assetId: effectiveAssetId,
          categoryId: itemToLog.categoryId || undefined,
          note: note.trim() || itemToLog.name,
          nextBillingDate: nextDate,
        },
      },
      {
        onSuccess: () => {
          toast.success(t("recurringLogSuccess"));
          close();
        },
        onError: () => {
          toast.error(t("recurringLogError"));
        },
      },
    );
  };

  return (
    <DialogContent
      className="sm:max-w-md w-[calc(100%-2rem)] p-0 rounded-2xl max-h-[85vh] sm:max-h-[90vh] flex flex-col overflow-hidden gap-0"
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <DialogHeader className="p-5 pb-3 pr-11 shrink-0 border-b border-border/40">
        <DialogTitle className="text-base font-semibold">
          {t("recurringLogModalTitle")}
        </DialogTitle>
        <DialogDescription className="text-xs text-muted-foreground">
          {t("recurringLogModalDesc")}
        </DialogDescription>
      </DialogHeader>

      <form
        onSubmit={handleSubmit}
        className="flex-1 min-h-0 flex flex-col overflow-hidden"
      >
        <div className="space-y-4 flex-1 min-h-0 overflow-y-auto p-5">
          {/* Target Service Info */}
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <span className="font-semibold text-sm text-foreground wrap-break-word flex-1 min-w-0">
                {itemToLog.name}
              </span>
              {itemToLog.category && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-medium shrink-0">
                  {itemToLog.category.name}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs pt-1.5 border-t border-border/40">
              <span className="text-muted-foreground">
                {t("recurringCycleLabelWithDate").replace(
                  "{date}",
                  cycleFormattedDate,
                )}
              </span>
              <span className="text-muted-foreground">
                {t("recurringNextBillingLabel")}:{" "}
                <span className="text-foreground font-medium">
                  {nextDateFormatted}
                </span>
              </span>
            </div>
          </div>

          {/* Amount Field - Reusing RecurringAmountField from RecurringFormSheet */}
          <RecurringAmountField
            id="recurring-log-amount"
            value={amount}
            onChange={setAmount}
            error={amount !== "" && Number(amount) <= 0}
            errorMessage={t("recurringAmountRequired")}
          />

          {/* Payment Date - Reusing ChooseADate from Transactions via RecurringDatePicker */}
          <RecurringDatePicker
            value={paymentDate}
            onChange={setPaymentDate}
            label={t("recurringPaymentDate")}
            locale={locale}
            calendarLocale={calendarLocale}
          />

          {/* Payment Account (Asset) Selection - Reusing TransactionAssetList from Transactions */}
          {assets.length > 0 && (
            <div className="-mx-5">
              <TransactionAssetList
                assets={assets}
                activeAssetId={selectedAssetId}
                onSelectAsset={setAssetId}
                label={`${t("recurringAssetLabel")} *`}
                containerClassName="px-5"
              />
            </div>
          )}

          {/* Description Field - Reusing TransactionDescriptionField from Add Transaction */}
          <TransactionDescriptionField
            id="recurring-log-note"
            value={note}
            onChange={setNote}
          />
        </div>

        <DialogFooter className="p-4 shrink-0 border-t border-border/60 bg-surface flex flex-row items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={close}
            disabled={logMutation.isPending}
            className="rounded-xl"
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            variant="success"
            size="sm"
            isLoading={logMutation.isPending}
            disabled={!amount || Number(amount) <= 0}
            className="rounded-xl shadow-xs"
            leftIcon={<CheckCircle2 className="size-3.5" />}
          >
            {t("recurringLogModalConfirm")}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export default function RecurringLogModal() {
  const { isOpen, itemToLog, targetBillingDate, close } =
    useRecurringLogModalStore();

  if (!itemToLog) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <RecurringLogForm
        key={`${itemToLog.id}-${targetBillingDate || "default"}`}
        itemToLog={itemToLog}
        targetBillingDate={targetBillingDate}
        close={close}
      />
    </Dialog>
  );
}
