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
import { getNextBillingDate } from "../helpers/recurring.helper";
import { format, parseISO } from "date-fns";
import { th, enUS } from "date-fns/locale";
import { toast } from "react-toastify";
import { CheckCircle2 } from "lucide-react";
import { RecurringExpense } from "@/shared/lib/types/recurring.type";
import TransactionAssetList from "@/features/transactions/components/TransactionAssetList";
import { RecurringDatePicker } from "./RecurringDatePicker";
import { RecurringAmountField } from "./RecurringAmountField";

interface RecurringLogFormProps {
  itemToLog: RecurringExpense;
  close: () => void;
}

function RecurringLogForm({
  itemToLog,
  close,
}: Readonly<RecurringLogFormProps>) {
  const { t, currentLanguage, locale } = useTranslation();
  const calendarLocale = currentLanguage === "th" ? th : enUS;
  const { data: assets = [] } = useAssets();
  const logMutation = useLogRecurringExpenseMutation();

  const [amount, setAmount] = useState<number | "">(itemToLog.amount);
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [assetId, setAssetId] = useState<string>(itemToLog.assetId || "");
  const selectedAssetId =
    assetId || itemToLog.assetId || (assets.length > 0 ? assets[0].id : "");
  const note = itemToLog.name;

  const nextDate = getNextBillingDate(
    itemToLog.nextBillingDate,
    itemToLog.billingCycle,
    itemToLog.firstBillingDate,
  );

  let nextDateFormatted = "";
  try {
    nextDateFormatted = format(parseISO(nextDate), "d MMM yyyy", {
      locale: calendarLocale,
    });
  } catch {
    nextDateFormatted = nextDate;
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
          note,
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
          <div className="p-3 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-between">
            <span className="font-semibold text-sm text-foreground">
              {itemToLog.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {t("recurringNextBillingLabel")}: {nextDateFormatted}
            </span>
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
  const { isOpen, itemToLog, close } = useRecurringLogModalStore();

  if (!itemToLog) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <RecurringLogForm
        key={itemToLog.id}
        itemToLog={itemToLog}
        close={close}
      />
    </Dialog>
  );
}
