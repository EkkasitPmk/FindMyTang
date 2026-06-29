"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useCategories } from "@/features/category/hooks/category.hook";
import { useAssets } from "@/features/assets/hooks/assets.hook";
import {
  useCreateExpenseMutation,
  useCreateIncomeMutation,
  useCreateTransferMutation,
  useCreateAdjustmentMutation,
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
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/customs/Button";

export default function TransactionsContainer() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransactionsContainerContent />
    </Suspense>
  );
}

function TransactionsContainerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const hasAssetId = searchParams.has("assetId");
  const defaultType =
    typeParam === "INCOME" ||
    typeParam === "EXPENSE" ||
    typeParam === "TRANSFER" ||
    typeParam === "ADJUSTMENT"
      ? typeParam
      : "EXPENSE";
  const defaultAssetId = searchParams.get("assetId") || null;

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateTransactionFormValues>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      amount: 0,
      note: "",
      transactionDate: new Date().toISOString(),
      assetId: "",
      categoryId: "",
    },
  });

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [amountDigits, setAmountDigits] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const createExpense = useCreateExpenseMutation({
    onSuccess: () => {
      toast.success("Expense saved successfully!");
      handleResetForm();
    },
  });
  const createIncome = useCreateIncomeMutation({
    onSuccess: () => {
      toast.success("Income saved successfully!");
      handleResetForm();
    },
  });
  const createTransfer = useCreateTransferMutation({
    onSuccess: () => {
      toast.success("Transfer saved successfully!");
      handleResetForm();
    },
  });
  const createAdjustment = useCreateAdjustmentMutation({
    onSuccess: () => {
      toast.success("Adjustment saved successfully!");
      handleResetForm();
    },
  });

  const [currentMonth] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  const [tempDate, setTempDate] = useState<Date | undefined>(date);
  const [displayMonth, setDisplayMonth] = useState<Date | undefined>(
    currentMonth || date || new Date(),
  );

  const handleConfirmDate = () => {
    if (tempDate) {
      setDate(tempDate);
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
  const [isMoreDetailsOpen, setIsMoreDetailsOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<
    "EXPENSE" | "INCOME" | "TRANSFER" | "ADJUSTMENT"
  >(defaultType);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(
    defaultAssetId,
  );
  const [selectedAssetToId, setSelectedAssetToId] = useState<string | null>(
    null,
  );

  const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => setFile(null);

  const handleTakeAPhoto = () => {
    setIsPhotoMenuOpen(false);
    cameraInputRef.current?.click();
  };

  const handleSelectAPhoto = () => {
    setIsPhotoMenuOpen(false);
    fileInputRef.current?.click();
  };

  const { data: categories } = useCategories();
  const filteredCategories =
    categories?.filter((c) => c.type === (transactionType as string)) || [];

  const { data: assets } = useAssets();

  const activeCategoryId =
    selectedCategoryId &&
    filteredCategories.some((c) => c.id === selectedCategoryId)
      ? selectedCategoryId
      : filteredCategories[0]?.id || null;

  const activeAssetId =
    selectedAssetId && assets?.some((a) => a.id === selectedAssetId)
      ? selectedAssetId
      : assets?.[0]?.id || null;

  const availableToAssets = assets?.filter((a) => a.id !== activeAssetId) || [];
  const activeAssetToId =
    selectedAssetToId &&
    availableToAssets.some((a) => a.id === selectedAssetToId)
      ? selectedAssetToId
      : availableToAssets[0]?.id || null;

  const handleResetForm = () => {
    reset({
      amount: 0,
      note: "",
      transactionDate: new Date().toISOString(),
      assetId: activeAssetId || "",
      categoryId: activeCategoryId || "",
      toAssetId: activeAssetToId || "",
    });
    setAmountDigits("");
    setFile(null);
    setDate(new Date());
  };

  useEffect(() => {
    if (
      activeCategoryId &&
      (transactionType === "EXPENSE" || transactionType === "INCOME")
    ) {
      setValue("categoryId", activeCategoryId, { shouldValidate: true });
    }
  }, [activeCategoryId, setValue, transactionType]);

  useEffect(() => {
    if (activeAssetId)
      setValue("assetId", activeAssetId, { shouldValidate: true });
  }, [activeAssetId, setValue]);

  useEffect(() => {
    if (date)
      setValue("transactionDate", date.toISOString(), { shouldValidate: true });
  }, [date, setValue]);

  useEffect(() => {
    if (transactionType === "TRANSFER" && activeAssetToId) {
      setValue("toAssetId", activeAssetToId, { shouldValidate: true });
    }
  }, [activeAssetToId, setValue, transactionType]);

  // --- Currency formatting logic ---
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, "");
    digits = digits.replace(/^0+/, "");
    if (digits.length > 10) {
      digits = digits.slice(0, 10);
    }
    setAmountDigits(digits);

    if (digits.length > 0) {
      const padded = digits.padStart(3, "0");
      const integerPart = padded.slice(0, -2);
      const decimalPart = padded.slice(-2);
      const numericVal = Number(`${integerPart}.${decimalPart}`);
      setValue("amount", numericVal, { shouldValidate: true });
    } else {
      setValue("amount", 0, { shouldValidate: true });
    }
  };

  const { displayAmount, numericAmount } = getFormattedAmount(amountDigits);
  const displayDate = formatDisplayDate(date);

  const onSubmit = (
    data: CreateTransactionFormValues,
    e?: React.BaseSyntheticEvent,
  ) => {
    const formData = new FormData(e?.target as HTMLFormElement);
    const note = formData.get("note") as string;

    const finalData = { ...data, note, file: file || undefined };

    if (transactionType === "TRANSFER") {
      if (!data.toAssetId) {
        toast.error("Please select a target asset");
        return;
      }
    } else if (transactionType === "EXPENSE" || transactionType === "INCOME") {
      if (!data.categoryId) {
        toast.error("Please select a category");
        return;
      }
    }

    if (transactionType === "EXPENSE") {
      createExpense.mutate({
        ...finalData,
        categoryId: data.categoryId as string,
      });
    } else if (transactionType === "INCOME") {
      createIncome.mutate({
        ...finalData,
        categoryId: data.categoryId as string,
      });
    } else if (transactionType === "TRANSFER") {
      createTransfer.mutate({
        ...finalData,
        toAssetId: data.toAssetId as string,
      });
    } else if (transactionType === "ADJUSTMENT") {
      const selectedAsset = assets?.find((a) => a.id === data.assetId);
      const currentBalance = selectedAsset ? selectedAsset.balance : 0;
      const difference = finalData.amount - currentBalance;

      createAdjustment.mutate({
        ...finalData,
        amount: difference,
      });
    }
  };

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
          Add Transaction
        </p>
      </div>

      <SegmentedControl
        value={transactionType}
        onChange={setTransactionType}
        options={[
          { label: "Expense", value: "EXPENSE" },
          { label: "Income", value: "INCOME" },
          { label: "Transfer", value: "TRANSFER" },
          { label: "Adjustment", value: "ADJUSTMENT" },
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
          activeCategoryId={activeCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
      )}

      <TransactionAssetList
        assets={assets ?? []}
        activeAssetId={activeAssetId}
        onSelectAsset={setSelectedAssetId}
        activeAssetToId={activeAssetToId}
        onSelectAssetTo={setSelectedAssetToId}
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
        onRemoveFile={handleRemoveFile}
        onTakeAPhoto={handleTakeAPhoto}
        onSelectAPhoto={handleSelectAPhoto}
        fileInputRef={fileInputRef}
        cameraInputRef={cameraInputRef}
        handleFileChange={handleFileChange}
      />

      {/* Save Transaction */}
      <section className="fixed bottom-18 left-0 right-0 mx-4 bg-background pt-2">
        <Button
          variant="unstyled"
          type="submit"
          disabled={
            createExpense.isPending ||
            createIncome.isPending ||
            createTransfer.isPending ||
            createAdjustment.isPending
          }
          className="flex items-center justify-center gap-2 bg-primary w-full text-white py-3 rounded-xl text-base font-bold capitalize disabled:opacity-50"
        >
          Save {transactionType.toLowerCase()}
          <ArrowRight size={18} />
        </Button>
      </section>
      {/* Save Transaction */}
    </form>
  );
}
