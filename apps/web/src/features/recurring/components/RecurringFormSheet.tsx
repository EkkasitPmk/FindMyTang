"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { useCategories } from "@/shared/lib/hooks/useCategories.hook";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/shared/components/animate-ui/components/radix/sheet";
import { useRecurringSheetStore } from "../hooks/recurring-sheet.hook";
import {
  useCreateRecurringExpenseMutation,
  useUpdateRecurringExpenseMutation,
} from "../hooks/useRecurring.hook";
import {
  RecurringExpense,
  RecurringCycle,
  RecurringStatus,
  CreateRecurringExpenseRequest,
} from "@/shared/lib/types/recurring.type";
import { toast } from "react-toastify";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { Input } from "@/shared/components/customs/Input";
import { useIsMobile } from "@/shared/lib/hooks/use-mobile";
import { cn } from "@/shared/lib/utils/core.util";
import { th, enUS } from "date-fns/locale";
import TransactionCategoryList from "@/features/transactions/components/TransactionCategoryList";
import TransactionAssetList from "@/features/transactions/components/TransactionAssetList";
import { RecurringBillingCyclePills } from "./RecurringBillingCyclePills";
import { RecurringDatePicker } from "./RecurringDatePicker";
import { RecurringAmountField } from "./RecurringAmountField";
import { Tag, FileText } from "lucide-react";

interface RecurringFormContentProps {
  itemToEdit: RecurringExpense | null;
  close: () => void;
}

function RecurringFormContent({
  itemToEdit,
  close,
}: Readonly<RecurringFormContentProps>) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { t, currentLanguage, locale } = useTranslation();
  const calendarLocale = currentLanguage === "th" ? th : enUS;
  const { data: categories = [], isPending: isCategoriesLoading } =
    useCategories();
  const { data: assets = [] } = useAssets();

  const createMutation = useCreateRecurringExpenseMutation();
  const updateMutation = useUpdateRecurringExpenseMutation();

  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === "EXPENSE" || !c.type),
    [categories],
  );
  const isEditing = Boolean(itemToEdit);

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [name, setName] = useState(itemToEdit?.name ?? "");
  const [amount, setAmount] = useState<number | "">(itemToEdit?.amount ?? "");
  const [billingCycle, setBillingCycle] = useState<RecurringCycle>(
    itemToEdit?.billingCycle ?? RecurringCycle.MONTHLY,
  );
  const [selectedDate, setSelectedDate] = useState<Date>(
    itemToEdit?.nextBillingDate
      ? new Date(itemToEdit.nextBillingDate)
      : new Date(),
  );

  const [categoryId, setCategoryId] = useState<string>(
    itemToEdit?.categoryId ?? "",
  );
  const [assetId, setAssetId] = useState<string>(itemToEdit?.assetId ?? "");
  const selectedAssetId =
    assetId || itemToEdit?.assetId || (assets.length > 0 ? assets[0].id : "");
  const [status, setStatus] = useState<RecurringStatus>(
    itemToEdit?.status ?? RecurringStatus.ACTIVE,
  );
  const [note, setNote] = useState<string>(itemToEdit?.note ?? "");

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    const finalAssetId = selectedAssetId;
    if (
      !name.trim() ||
      !amount ||
      Number(amount) <= 0 ||
      !categoryId ||
      !finalAssetId
    )
      return;

    const payload: CreateRecurringExpenseRequest = {
      name: name.trim(),
      amount: Number(amount),
      billingCycle,
      firstBillingDate:
        isEditing && itemToEdit?.firstBillingDate
          ? itemToEdit.firstBillingDate
          : selectedDate.toISOString(),
      nextBillingDate: selectedDate.toISOString(),
      categoryId,
      assetId: finalAssetId,
      status,
      note: note.trim() || null,
    };

    if (isEditing && itemToEdit) {
      updateMutation.mutate(
        { id: itemToEdit.id, data: payload },
        {
          onSuccess: () => {
            toast.success(t("recurringUpdatedSuccess"));
            close();
          },
          onError: () => {
            toast.error(t("recurringUpdateError"));
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success(t("recurringCreatedSuccess"));
          close();
        },
        onError: () => {
          toast.error(t("recurringCreateError"));
        },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  let submitButtonText = t("recurringAddBtn");
  if (isPending) {
    submitButtonText = t("saving");
  } else if (isEditing) {
    submitButtonText = t("saveChanges");
  }

  const isNameInvalid = hasAttemptedSubmit && !name.trim();
  const isAmountInvalid =
    hasAttemptedSubmit && (!amount || Number(amount) <= 0);
  const isCategoryInvalid = hasAttemptedSubmit && !categoryId;
  const isAssetInvalid = hasAttemptedSubmit && !selectedAssetId;

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <SheetHeader className="shrink-0">
        <SheetTitle>
          {isEditing ? t("recurringEditTitle") : t("recurringAddTitle")}
        </SheetTitle>
        <SheetDescription>{t("navRecurringDesc")}</SheetDescription>
      </SheetHeader>

      <form
        onSubmit={handleSubmit}
        className="flex-1 min-h-0 flex flex-col overflow-hidden"
      >
        <div className="space-y-4 flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain p-4">
          {/* Name Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="recurring-form-name"
              className="text-sm font-semibold text-secondary-text"
            >
              {t("recurringNameLabel")} *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Tag size={18} className="text-disabled-text" />
              </div>
              <Input
                id="recurring-form-name"
                type="text"
                maxLength={50}
                placeholder={t("recurringNamePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                error={isNameInvalid}
              />
            </div>
            {isNameInvalid && (
              <p className="text-xs text-destructive font-medium">
                {t("recurringNameRequired")}
              </p>
            )}
          </div>

          {/* Amount Field - Reusable RecurringAmountField */}
          <RecurringAmountField
            id="recurring-form-amount"
            value={amount}
            onChange={setAmount}
            error={isAmountInvalid}
            errorMessage={t("recurringAmountRequired")}
          />

          {/* Category Field - Reusing TransactionCategoryList from Add Transaction */}
          <div className="flex flex-col gap-1.5">
            <TransactionCategoryList
              categories={expenseCategories}
              activeCategoryId={categoryId}
              onSelectCategory={setCategoryId}
              label={`${t("recurringCategoryLabel")} *`}
              containerClassName="px-0"
              isLoadingCategoryList={isCategoriesLoading}
              onEditClick={() => {
                close();
                router.push(
                  isMobile ? "/categories" : "/settings?tab=categories",
                );
              }}
            />
            {isCategoryInvalid && (
              <p className="text-xs text-destructive font-medium">
                {t("errSelectCategory")}
              </p>
            )}
          </div>

          {/* Payment Account (Asset) Selection - Reusing TransactionAssetList from Transactions */}
          <div className="-mx-4 flex flex-col gap-1.5">
            <TransactionAssetList
              assets={assets}
              activeAssetId={selectedAssetId}
              onSelectAsset={setAssetId}
              label={`${t("recurringAssetLabel")} *`}
              containerClassName="px-4"
            />
            {isAssetInvalid && (
              <p className="text-xs text-destructive font-medium px-4">
                {t("recurringAssetRequired")}
              </p>
            )}
          </div>

          {/* Billing Cycle - 1-Tap Segmented Control */}
          <RecurringBillingCyclePills
            value={billingCycle}
            onChange={setBillingCycle}
            label={t("recurringCycleLabel")}
          />

          {/* Next Billing Date with Transaction ChooseADate Component */}
          <RecurringDatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            label={t("recurringNextBillingLabel")}
            locale={locale}
            calendarLocale={calendarLocale}
          />

          {/* Note Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="recurring-form-note"
              className="text-sm font-semibold text-secondary-text"
            >
              {t("recurringNoteLabel")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <FileText size={18} className="text-disabled-text" />
              </div>
              <Input
                id="recurring-form-note"
                type="text"
                placeholder={t("recurringNotePlaceholder")}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status (when editing) */}
          {isEditing && (
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-secondary-text">
                {t("recurringStatusLabel")}
              </p>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-surface-secondary/50 rounded-lg border border-border">
                <Button
                  variant="unstyled"
                  type="button"
                  onClick={() => setStatus(RecurringStatus.ACTIVE)}
                  className={cn(
                    "py-2 text-xs font-semibold rounded-md transition-all cursor-pointer text-center",
                    status === RecurringStatus.ACTIVE
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs"
                      : "text-secondary-text hover:text-primary-text",
                  )}
                >
                  {t("recurringStatusActive")}
                </Button>
                <Button
                  variant="unstyled"
                  type="button"
                  onClick={() => setStatus(RecurringStatus.PAUSED)}
                  className={cn(
                    "py-2 text-xs font-semibold rounded-md transition-all cursor-pointer text-center",
                    status === RecurringStatus.PAUSED
                      ? "bg-zinc-500/15 text-zinc-600 dark:text-zinc-300 border border-zinc-500/30 shadow-xs"
                      : "text-secondary-text hover:text-primary-text",
                  )}
                >
                  {t("recurringStatusPaused")}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sheet Footer matching AssetForm */}
        <SheetFooter className="shrink-0">
          <SheetClose asChild>
            <Button
              variant="unstyled"
              type="button"
              onClick={close}
              className="w-full border border-border rounded-lg py-2.5 text-sm font-medium hover:bg-surface-secondary transition-colors cursor-pointer text-secondary-text bg-surface shadow-sm"
            >
              {t("cancel")}
            </Button>
          </SheetClose>
          <Button
            variant="unstyled"
            type="submit"
            disabled={isPending || !name.trim() || !amount}
            className="w-full text-white bg-primary rounded-lg py-2.5 text-sm font-medium transition-all shadow-md disabled:opacity-50 cursor-pointer hover:opacity-90 hover:shadow-lg"
          >
            {submitButtonText}
          </Button>
        </SheetFooter>
      </form>
    </div>
  );
}

export default function RecurringFormSheet() {
  const { isOpen, itemToEdit, close } = useRecurringSheetStore();
  const isMobile = useIsMobile();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="sm:mx-auto sm:max-w-lg"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        {isOpen && (
          <RecurringFormContent
            key={itemToEdit ? itemToEdit.id : "new"}
            itemToEdit={itemToEdit}
            close={close}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
