"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useCategories } from "@/features/category/hooks/category.hook";
import { useAssets } from "@/features/assets/hooks/assets.hook";
import {
  useCreateExpenseMutation,
  useCreateIncomeMutation,
  useCreateTransferMutation,
  useCreateAdjustmentMutation,
  useTransactionsQuery,
  useUpdateTransactionMutation,
} from "../hooks/transaction.hook";
import {
  createTransactionSchema,
  CreateTransactionFormValues,
} from "../schemas/transaction.schema";
import { toast } from "react-toastify";
import TransactionCategoryList from "../components/TransactionCategoryList";
import TransactionAssetList from "../components/TransactionAssetList";
import TransactionMoreDetails from "../components/TransactionMoreDetails";
import { SegmentedControl } from "@/shared/components/customs/SegmentedControl";
import { CurrencyInput } from "@/shared/components/customs/CurrencyInput";
import { getFormattedAmount } from "../utils/currency.util";
import { formatDisplayDate } from "../helpers/date.helper";
import {
  submitTransaction,
  resolveDefaultTransactionType,
  createDefaultFormValues,
  getActiveItemId,
  parseAmountDigits,
  convertDigitsToAmount,
  convertAmountToDigits,
} from "../helpers/transaction.helper";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/customs/Button";
import { TransactionType } from "../types/transaction.type";

export default function TransactionsContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const hasAssetId = searchParams.has("assetId");
  const defaultAssetId = searchParams.get("assetId") || null;
  const typeParam = searchParams.get("type");

  const queryParams = useMemo(
    () => (hasAssetId ? { assetId: defaultAssetId! } : undefined),
    [hasAssetId, defaultAssetId],
  );
  const { data: txData, isLoading } = useTransactionsQuery(queryParams);

  const existingTx = useMemo(
    () => txData?.items.find((t) => t.id === editId),
    [txData, editId],
  );
  const defaultType = useMemo(
    () => resolveDefaultTransactionType(existingTx, typeParam),
    [existingTx, typeParam],
  );

  const [transactionType, setTransactionType] =
    useState<TransactionType>(defaultType);

  const [prevTxId, setPrevTxId] = useState<string | null>(null);
  const [prevTypeParam, setPrevTypeParam] = useState<string | null>(typeParam);

  const [amountDigits, setAmountDigits] = useState<string>("");
  const [removedAttachment, setRemovedAttachment] = useState(false);
  const [isMoreDetailsOpen, setIsMoreDetailsOpen] = useState(false);

  const currentMonth = useMemo(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    [],
  );

  const [displayMonth, setDisplayMonth] = useState<Date | undefined>(
    currentMonth,
  );

  if (existingTx && existingTx.id !== prevTxId) {
    setPrevTxId(existingTx.id);
    setTransactionType(existingTx.type);
    setAmountDigits(convertAmountToDigits(existingTx.amount));
    setDisplayMonth(new Date(existingTx.transactionDate));
    setRemovedAttachment(false);
    if (existingTx.note || existingTx.attachmentUrl) setIsMoreDetailsOpen(true);
  } else if (!existingTx && typeParam !== prevTypeParam) {
    setPrevTypeParam(typeParam);
    setTransactionType(resolveDefaultTransactionType(undefined, typeParam));
  }

  const defaultValues = useMemo(
    () => createDefaultFormValues(existingTx, defaultAssetId),
    [existingTx, defaultAssetId],
  );

  const {
    handleSubmit,
    setValue,
    control,
    reset,
    register,
    formState: { errors },
  } = useForm<CreateTransactionFormValues>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const watchTransactionDate = useWatch({ control, name: "transactionDate" });
  const watchCategoryId = useWatch({ control, name: "categoryId" });
  const watchAssetId = useWatch({ control, name: "assetId" });
  const watchToAssetId = useWatch({ control, name: "toAssetId" });

  const date = useMemo(
    () => (watchTransactionDate ? new Date(watchTransactionDate) : new Date()),
    [watchTransactionDate],
  );

  const [file, setFile] = useState<File | null>(null);

  const handleSuccess = useCallback(
    (message: string) => {
      toast.success(message);
      reset(defaultValues);
      setAmountDigits("");
      setFile(null);
    },
    [reset, defaultValues],
  );

  const createExpense = useCreateExpenseMutation({
    onSuccess: () => handleSuccess("Expense saved successfully!"),
  });
  const createIncome = useCreateIncomeMutation({
    onSuccess: () => handleSuccess("Income saved successfully!"),
  });
  const createTransfer = useCreateTransferMutation({
    onSuccess: () => handleSuccess("Transfer saved successfully!"),
  });
  const createAdjustment = useCreateAdjustmentMutation({
    onSuccess: () => handleSuccess("Adjustment saved successfully!"),
  });
  const updateTransaction = useUpdateTransactionMutation({
    onSuccess: () => {
      toast.success("Transaction updated successfully!");
      if (editId) {
        router.back();
      } else {
        reset(defaultValues);
        setAmountDigits("");
        setFile(null);
      }
    },
  });

  const [tempDate, setTempDate] = useState<Date | undefined>(date);

  // displayMonth state is now managed above during render

  const handleConfirmDate = () => {
    if (tempDate) {
      setValue("transactionDate", tempDate.toISOString(), {
        shouldValidate: true,
      });
    }
    setIsCalendarOpen(false);
  };

  const handlePresetClick = (daysToAdd: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysToAdd);
    setTempDate(newDate);
    setDisplayMonth(newDate);
  };

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setRemovedAttachment(true);
  };

  const handleTakeAPhoto = () => {
    setIsPhotoMenuOpen(false);
    cameraInputRef.current?.click();
  };

  const handleSelectAPhoto = () => {
    setIsPhotoMenuOpen(false);
    fileInputRef.current?.click();
  };

  const { data: categories } = useCategories();
  const filteredCategories = useMemo(
    () =>
      categories?.filter((c) => c.type === (transactionType as string)) || [],
    [categories, transactionType],
  );

  const { data: assets } = useAssets();
  const safeAssets = useMemo(() => assets ?? [], [assets]);

  const activeCategoryId = getActiveItemId(watchCategoryId, filteredCategories);
  const activeAssetId = getActiveItemId(watchAssetId, safeAssets);

  const availableToAssets = useMemo(
    () => safeAssets.filter((a) => a.id !== activeAssetId),
    [safeAssets, activeAssetId],
  );
  const activeAssetToId = getActiveItemId(watchToAssetId, availableToAssets);

  useEffect(() => {
    const isCategoryType =
      transactionType === "EXPENSE" || transactionType === "INCOME";
    if (
      activeCategoryId &&
      activeCategoryId !== watchCategoryId &&
      isCategoryType
    ) {
      setValue("categoryId", activeCategoryId, { shouldValidate: true });
    }
  }, [activeCategoryId, watchCategoryId, setValue, transactionType]);

  useEffect(() => {
    if (activeAssetId && activeAssetId !== watchAssetId) {
      setValue("assetId", activeAssetId, { shouldValidate: true });
    }
  }, [activeAssetId, watchAssetId, setValue]);

  useEffect(() => {
    if (
      activeAssetToId &&
      activeAssetToId !== watchToAssetId &&
      transactionType === "TRANSFER"
    ) {
      setValue("toAssetId", activeAssetToId, { shouldValidate: true });
    }
  }, [activeAssetToId, watchToAssetId, setValue, transactionType]);

  const handleResetForm = () => {
    reset(defaultValues);
    setAmountDigits("");
    setFile(null);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = parseAmountDigits(e.target.value);
    setAmountDigits(digits);
    setValue("amount", convertDigitsToAmount(digits), { shouldValidate: true });
  };

  const { displayAmount, numericAmount } = getFormattedAmount(amountDigits);
  const displayDate = formatDisplayDate(date);

  const onSubmit = (
    data: CreateTransactionFormValues,
    e?: React.BaseSyntheticEvent,
  ) => {
    const formData = new FormData(e?.target as HTMLFormElement);
    const note = formData.get("note") as string;

    submitTransaction({
      transactionType,
      data: { ...data, note },
      file,
      assets: safeAssets,
      createExpense,
      createIncome,
      createTransfer,
      createAdjustment,
      updateTransaction,
      editId,
      removedAttachment,
      toast,
    });
  };

  if (editId && isLoading) {
    return (
      <div className="flex flex-col h-[calc(100dvh-100px)] items-center justify-center">
        <p className="text-gray-500">Loading transaction...</p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4 pb-24"
      onSubmit={handleSubmit(onSubmit)}
      onReset={handleResetForm}
    >
      <div
        className={cn(
          "flex items-center relative",
          hasAssetId ? "" : "my-4 mb-8",
        )}
      >
        {hasAssetId && (
          <Button
            variant="unstyled"
            type="button"
            onClick={() => router.back()}
            className="p-1 -ml-1 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={24} />
          </Button>
        )}
        <p className="text-center text-2xl font-bold absolute left-1/2 -translate-x-1/2 truncate">
          {editId ? "Edit Transaction" : "Add Transaction"}
        </p>
      </div>

      <SegmentedControl
        value={transactionType}
        onChange={(val) => setTransactionType(val as TransactionType)}
        options={[
          { label: "Expense", value: "EXPENSE" },
          { label: "Income", value: "INCOME" },
          ...(editId &&
          (existingTx?.type === "EXPENSE" || existingTx?.type === "INCOME")
            ? []
            : [
                { label: "Transfer", value: "TRANSFER" },
                { label: "Adjustment", value: "ADJUSTMENT" },
              ]),
        ]}
      />

      <div className="flex flex-col items-center gap-1">
        <CurrencyInput
          id="balance"
          value={displayAmount}
          onChange={handleAmountChange}
        />
        <input type="hidden" name="amount" value={numericAmount} />
        {errors.amount && (
          <p className="text-red-500 text-xs">{errors.amount.message}</p>
        )}
      </div>

      {(transactionType === "EXPENSE" || transactionType === "INCOME") && (
        <TransactionCategoryList
          categories={filteredCategories}
          activeCategoryId={watchCategoryId || null}
          onSelectCategory={(id) =>
            setValue("categoryId", id, { shouldValidate: true })
          }
        />
      )}

      <TransactionAssetList
        assets={safeAssets}
        activeAssetId={watchAssetId || null}
        onSelectAsset={(id) =>
          setValue("assetId", id, { shouldValidate: true })
        }
        activeAssetToId={watchToAssetId || null}
        onSelectAssetTo={(id) =>
          setValue("toAssetId", id, { shouldValidate: true })
        }
        transactionType={transactionType}
      />

      <TransactionMoreDetails
        isMoreDetailsOpen={isMoreDetailsOpen}
        setIsMoreDetailsOpen={setIsMoreDetailsOpen}
        displayDate={displayDate}
        tempDate={tempDate}
        setTempDate={setTempDate}
        displayMonth={displayMonth}
        setDisplayMonth={setDisplayMonth}
        onPresetClick={handlePresetClick}
        onConfirmDate={handleConfirmDate}
        isCalendarOpen={isCalendarOpen}
        setIsCalendarOpen={setIsCalendarOpen}
        isPhotoMenuOpen={isPhotoMenuOpen}
        setIsPhotoMenuOpen={setIsPhotoMenuOpen}
        file={file}
        attachmentUrl={removedAttachment ? null : existingTx?.attachmentUrl}
        onRemoveFile={handleRemoveFile}
        onTakeAPhoto={handleTakeAPhoto}
        onSelectAPhoto={handleSelectAPhoto}
        fileInputRef={fileInputRef}
        cameraInputRef={cameraInputRef}
        handleFileChange={handleFileChange}
        register={register}
      />

      <section className="fixed bottom-18 left-0 right-0 mx-4 bg-background pt-2">
        <Button
          variant="unstyled"
          type="submit"
          disabled={
            createExpense.isPending ||
            createIncome.isPending ||
            createTransfer.isPending ||
            createAdjustment.isPending ||
            updateTransaction.isPending
          }
          className="flex items-center justify-center gap-2 bg-primary w-full text-white py-3 rounded-xl text-base font-bold capitalize disabled:opacity-50"
        >
          Save {transactionType.toLowerCase()}
          <ArrowRight size={18} />
        </Button>
      </section>
    </form>
  );
}
