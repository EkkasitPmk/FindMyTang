"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";
import { ArrowRight, ChevronLeft, Trash } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useCategories } from "@/features/category/hooks/category.hook";
import { useAssets } from "@/features/assets/hooks/assets.hook";
import {
  useCreateTransactionMutation,
  useTransactionQuery,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} from "../hooks/transaction.hook";
import {
  createTransactionSchema,
  CreateTransactionFormValues,
} from "../schemas/transaction.schema";
import { toast } from "react-toastify";
import TransactionCategoryList from "../components/TransactionCategoryList";
import TransactionAssetList from "../components/TransactionAssetList";
import TransactionMoreDetails from "../components/TransactionMoreDetails";
import {
  useTransactionFormSync,
  useTransactionInitialization,
} from "../hooks/transaction-form.hook";

import ConfirmModal from "@/shared/components/customs/ConfirmModal";
import { useConfirmModal } from "@/shared/lib/hooks/useConfirmModal.hook";
import LoadingModal from "@/shared/components/customs/LoadingModal";
import { SegmentedControl } from "@/shared/components/customs/SegmentedControl";
import { CurrencyInput } from "@/shared/components/customs/CurrencyInput";
import { useCurrencyInput } from "@/shared/lib/hooks/useCurrencyInput.hook";
import {
  getFormattedAmount,
  parseAmountDigits,
  convertDigitsToAmount,
  convertAmountToDigits,
} from "@/shared/lib/utils/currency.util";
import { formatDisplayDate } from "@/shared/lib/helpers/date.helper";
import { th, enUS } from "date-fns/locale";
import {
  submitTransaction,
  resolveDefaultTransactionType,
  createDefaultFormValues,
  getActiveItemId,
  getTransactionTypeOptions,
} from "../helpers/transaction.helper";
import { cn } from "@/shared/lib/utils/core.util";
import { Button } from "@/shared/components/customs/Button";
import { TransactionType } from "../types/transaction.type";
import { Skeleton } from "@/shared/components/ui/skeleton";
import imageCompression from "browser-image-compression";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

export default function TransactionsContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const hasAssetId = searchParams.has("assetId");
  const defaultAssetId = searchParams.get("assetId") || null;
  const typeParam = searchParams.get("type");
  const { t, locale, currentLanguage } = useTranslation();

  const {
    data: existingTx,
    isPending: isTxPending,
    isFetching: isTxFetching,
  } = useTransactionQuery(editId || undefined);
  const isLoadingTx = isTxPending || isTxFetching;
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
  const [file, setFile] = useState<File | null>(null);

  const {
    isOpen: isDeleteModalOpen,
    open: openDeleteModal,
    close: closeDeleteModal,
    isHardDelete,
    setIsHardDelete,
    inputValue: confirmInput,
    setInputValue: setConfirmInput,
  } = useConfirmModal();

  const currentMonth = useMemo(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    [],
  );

  const [displayMonth, setDisplayMonth] = useState<Date | undefined>(
    currentMonth,
  );

  const mounted = useMounted();

  useTransactionInitialization({
    existingTx,
    prevTxId,
    setPrevTxId,
    setTransactionType,
    setAmountDigits,
    setDisplayMonth,
    setRemovedAttachment,
    setIsMoreDetailsOpen,
    typeParam,
    prevTypeParam,
    setPrevTypeParam,
    resolveDefaultTransactionType,
    convertAmountToDigits,
    setFile,
  });

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

  const handleSuccess = useCallback(
    (message: string) => {
      toast.success(message);
      reset(defaultValues);
      setAmountDigits("");
      setFile(null);
    },
    [reset, defaultValues],
  );

  const createTransaction = useCreateTransactionMutation({
    onSuccess: (data, variables) => {
      let typeStr = variables.type.toLowerCase();
      if (typeStr === "expense") typeStr = t("expense");
      else if (typeStr === "income") typeStr = t("income");
      else if (typeStr === "transfer") typeStr = t("transfer");
      else if (typeStr === "adjustment") typeStr = t("adjustment");

      handleSuccess(t("transactionSavedSuccess").replace("{type}", typeStr));
    },
  });
  const updateTransaction = useUpdateTransactionMutation({
    onSuccess: () => {
      toast.success(t("transactionUpdatedSuccess"));
      if (editId) {
        router.back();
      } else {
        reset(defaultValues);
        setAmountDigits("");
        setFile(null);
      }
    },
  });

  const deleteTransaction = useDeleteTransactionMutation({
    onSuccess: () => {
      toast.success(t("transactionDeletedSuccess"));
      router.back();
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
    if (tempDate) {
      newDate.setHours(tempDate.getHours(), tempDate.getMinutes(), 0, 0);
    }
    setTempDate(newDate);
    setDisplayMonth(newDate);
  };

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const originalFile = e.target.files[0];
      try {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
          initialQuality: 0.8,
        };
        const compressedFile = await imageCompression(originalFile, options);
        // imageCompression returns a File or Blob, ensure it's set as File
        const newFile = new File([compressedFile], originalFile.name, {
          type: compressedFile.type || originalFile.type,
          lastModified: Date.now(),
        });
        setFile(newFile);
      } catch (error) {
        console.error("Error compressing image:", error);
        setFile(originalFile); // Fallback to original if compression fails
      }
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

  const handleEditCategoryClick = () => {
    router.push("/categories");
  };

  const {
    data: categories,
    isPending: isCategoryPending,
    isFetching: isCategoryFetching,
  } = useCategories();
  const isLoadingCategoryList =
    !mounted || isCategoryPending || isCategoryFetching;
  const filteredCategories = useMemo(
    () =>
      categories?.filter((c) => c.type === (transactionType as string)) || [],
    [categories, transactionType],
  );

  const {
    data: assets,
    isPending: isAssetPending,
    isFetching: isAssetFetching,
  } = useAssets();
  const isLoadingAssetList = !mounted || isAssetPending || isAssetFetching;
  const safeAssets = useMemo(() => assets ?? [], [assets]);

  const activeCategoryId = getActiveItemId(watchCategoryId, filteredCategories);
  const activeAssetId = getActiveItemId(watchAssetId, safeAssets);

  const availableToAssets = useMemo(
    () => safeAssets.filter((a) => a.id !== activeAssetId),
    [safeAssets, activeAssetId],
  );
  const activeAssetToId = getActiveItemId(watchToAssetId, availableToAssets);

  useTransactionFormSync({
    transactionType,
    activeCategoryId,
    watchCategoryId,
    activeAssetId,
    watchAssetId,
    activeAssetToId,
    watchToAssetId,
    setValue,
  });

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
  const displayDate = formatDisplayDate(date, true, locale, t);
  const calendarLocale = currentLanguage === "th" ? th : enUS;

  const { inputRef: amountInputRef, handleChange: handleCurrencyInput } =
    useCurrencyInput(displayAmount, handleAmountChange);

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
      createTransaction,
      updateTransaction,
      editId,
      removedAttachment,
      toast,
    });
  };

  const transactionTypeOptions = useMemo(
    () => getTransactionTypeOptions(editId, existingTx?.type, t),
    [editId, existingTx?.type, t],
  );

  let transactionTypeStr = "";
  switch (transactionType) {
    case "EXPENSE":
      transactionTypeStr = t("expense");
      break;
    case "INCOME":
      transactionTypeStr = t("income");
      break;
    case "TRANSFER":
      transactionTypeStr = t("transfer");
      break;
    default:
      transactionTypeStr = t("adjustment");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onReset={handleResetForm}
      className={cn(isMoreDetailsOpen && "pb-28")}
    >
      <header
        className={cn(
          "flex items-center relative mb-2 px-4",
          hasAssetId ? "" : "mb-2 justify-center",
          editId ? "justify-between" : "",
        )}
      >
        {hasAssetId && (
          <Button
            variant="unstyled"
            type="button"
            onClick={() => router.back()}
            className="p-1 -ml-1 cursor-pointer hover:bg-surface-secondary transition-colors"
          >
            <ChevronLeft size={24} />
          </Button>
        )}
        <p
          className={cn(
            "text-center text-2xl font-bold truncate",
            hasAssetId ? "absolute left-1/2 -translate-x-1/2" : "",
          )}
        >
          {editId ? t("editTransaction") : t("addTransaction")}
        </p>
        {editId && (
          <Button
            variant="unstyled"
            type="button"
            className="p-1 cursor-pointer hover:bg-surface-secondary transition-colors text-expense rounded-full"
            onClick={openDeleteModal}
          >
            <Trash size={20} />
          </Button>
        )}
      </header>

      <div className="space-y-4 px-4">
        {editId && (!mounted || isLoadingTx) ? (
          <Skeleton className="w-full h-10 rounded-lg" />
        ) : (
          <SegmentedControl
            value={transactionType}
            onChange={(val) => setTransactionType(val as TransactionType)}
            options={transactionTypeOptions}
          />
        )}

        <section className="flex flex-col items-center gap-1 relative min-h-10 justify-center">
          {editId && (!mounted || isLoadingTx) ? (
            <Skeleton className="w-60 h-10 rounded-lg" />
          ) : (
            <>
              <CurrencyInput
                id="balance"
                ref={amountInputRef}
                value={displayAmount}
                onChange={handleCurrencyInput}
              />
              <input type="hidden" name="amount" value={numericAmount} />
              {errors.amount && (
                <p className="text-expense text-xs">{errors.amount.message}</p>
              )}
            </>
          )}
        </section>

        {(transactionType === "EXPENSE" || transactionType === "INCOME") && (
          <TransactionCategoryList
            categories={filteredCategories}
            activeCategoryId={watchCategoryId || null}
            onSelectCategory={(id) =>
              setValue("categoryId", id, { shouldValidate: true })
            }
            onEditClick={handleEditCategoryClick}
            isLoadingCategoryList={isLoadingCategoryList}
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
          isLoadingAssetList={isLoadingAssetList}
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
          isLoadingTx={!!(editId && (!mounted || isLoadingTx))}
          calendarLocale={calendarLocale}
        />

        <section className="fixed bottom-16 left-0 right-0 mx-4 pb-4 bg-background pt-2">
          <Button
            variant="unstyled"
            type="submit"
            disabled={
              createTransaction.isPending ||
              updateTransaction.isPending ||
              deleteTransaction.isPending
            }
            className="flex items-center justify-center gap-2 bg-primary w-full text-white py-3 rounded-xl text-base font-bold capitalize disabled:opacity-50"
          >
            {t("saveTransactionStr").replace("{type}", transactionTypeStr)}
            <ArrowRight size={18} />
          </Button>
        </section>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={() => {
          if (editId) {
            deleteTransaction.mutate({
              id: editId,
              isHardDelete: Boolean(isHardDelete),
            });
            closeDeleteModal();
          }
        }}
        icon={Trash}
        title={t("deleteTransaction")}
        des={t("deleteTransactionDesc")}
        confirmLabel={t("delete")}
        withHardDeleteOption={true}
        isHardDelete={isHardDelete}
        onHardDeleteChange={setIsHardDelete}
        hardDeleteCheckboxLabel={t("deletePermanently")}
        inputValue={confirmInput}
        onInputChange={setConfirmInput}
      />

      <LoadingModal
        isOpen={
          createTransaction.isPending ||
          updateTransaction.isPending ||
          deleteTransaction.isPending
        }
      />
    </form>
  );
}
