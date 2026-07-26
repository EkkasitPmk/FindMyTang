"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";
import { ArrowRight, ChevronLeft, Trash } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useCategories } from "@/shared/lib/hooks/useCategories.hook";
import {
  useCreateTransactionMutation,
  useTransactionQuery,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} from "../hooks/transaction.hook";
import {
  createTransactionSchema,
  CreateTransactionFormValues,
} from "../schemas/transaction.form.schema";
import { toast } from "react-toastify";
import TransactionCategoryList from "../components/TransactionCategoryList";
import TransactionAssetList from "../components/TransactionAssetList";
import TransactionMoreDetails from "../components/TransactionMoreDetails";
import ChooseADate from "../components/ChooseADate";
import {
  useTransactionFormSync,
  useTransactionInitialization,
} from "../hooks/transaction-form.hook";
import ConfirmModal from "@/shared/components/customs/ConfirmModal";
import { useConfirmModal } from "@/shared/lib/hooks/useConfirmModal.hook";
import LoadingModal from "@/shared/components/customs/LoadingModal";
import { useModalState } from "@/shared/lib/hooks/useModalState.hook";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContents,
  TabsContent,
} from "@/shared/components/animate-ui/components/animate/tabs";
import { CurrencyInput } from "@/shared/components/customs/CurrencyInput";
import { useCurrencyInput } from "../hooks/useCurrencyInput.hook";
import {
  getFormattedAmount,
  parseAmountDigits,
  convertDigitsToAmount,
  convertAmountToDigits,
} from "@/shared/lib/utils/currency.util";
import {
  formatDisplayDate,
  updatePresetDate,
} from "@/shared/lib/helpers/date.helper";
import { th, enUS } from "date-fns/locale";
import {
  submitTransaction,
  resolveDefaultTransactionType,
  createDefaultFormValues,
  getActiveItemId,
  getTransactionTypeOptions,
  getTypeLabel,
  parseErrorMessage,
  checkIsLoading,
  checkIsTxLoading,
  checkIsSubmitting,
  isCategoryType,
  getLoadingModalProps,
} from "../helpers/transaction.helper";
import { cn } from "@/shared/lib/utils/core.util";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { TransactionType } from "@/shared/lib/types/transaction.type";
import { Category } from "@/shared/lib/types/category.type";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { compressImageFile } from "../utils/image.util";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/shared/lib/types/api.type";

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

  const mounted = useMounted();
  const isTxLoading = checkIsTxLoading(
    mounted,
    editId,
    isTxPending,
    isTxFetching,
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
  const [file, setFile] = useState<File | null>(null);
  const { modalState, setModalState, resetModalState } = useModalState();

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
    clearErrors,
    formState: { errors, isSubmitted, touchedFields },
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
    (message: string, shouldRedirect: boolean = false) => {
      setModalState({
        isOpen: true,
        status: "success",
        message,
        shouldRedirect,
      });
      reset(defaultValues);
      setAmountDigits("");
      setFile(null);
    },
    [reset, defaultValues, setModalState],
  );

  const createTransaction = useCreateTransactionMutation({
    onSuccess: (_, variables) => {
      const typeStr = getTypeLabel(variables.type, t);
      handleSuccess(t("transactionSavedSuccess").replace("{type}", typeStr));
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
      setModalState({
        isOpen: true,
        status: "error",
        message: parseErrorMessage(err, "Failed to save transaction"),
      });
    },
  });

  const updateTransaction = useUpdateTransactionMutation({
    onSuccess: () => {
      handleSuccess(t("transactionUpdatedSuccess"), !!editId);
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
      setModalState({
        isOpen: true,
        status: "error",
        message: parseErrorMessage(err, "Failed to update transaction"),
      });
    },
  });

  const deleteTransaction = useDeleteTransactionMutation({
    onSuccess: () => {
      setModalState({
        isOpen: true,
        status: "success",
        message: t("transactionDeletedSuccess"),
        shouldRedirect: true,
      });
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
      setModalState({
        isOpen: true,
        status: "error",
        message: parseErrorMessage(err, "Failed to delete transaction"),
      });
    },
  });

  const isSubmitting = checkIsSubmitting(
    createTransaction.isPending,
    updateTransaction.isPending,
    deleteTransaction.isPending,
  );

  const handleModalClose = () => {
    const shouldRedirect = modalState.shouldRedirect;
    resetModalState();
    if (shouldRedirect) {
      router.back();
    }
  };

  const handleConfirmDelete = () => {
    if (editId) {
      deleteTransaction.mutate({
        id: editId,
        isHardDelete: Boolean(isHardDelete),
      });
      closeDeleteModal();
    }
  };

  const [tempDate, setTempDate] = useState<Date | undefined>(date);
  const [prevDate, setPrevDate] = useState<Date>(date);

  if (date !== prevDate) {
    setPrevDate(date);
    setTempDate(date);
    setDisplayMonth(date);
  }

  const handleConfirmDate = () => {
    if (tempDate) {
      setValue("transactionDate", tempDate.toISOString(), {
        shouldValidate: true,
      });
    }
    setIsCalendarOpen(false);
  };

  const handlePresetClick = (daysToAdd: number) => {
    const newDate = updatePresetDate(daysToAdd, tempDate);
    setTempDate(newDate);
    setDisplayMonth(newDate);
  };

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalFile = e.target.files?.[0];
    if (originalFile) {
      const newFile = await compressImageFile(originalFile);
      setFile(newFile);
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
  const isLoadingCategoryList = checkIsLoading(
    mounted,
    isCategoryPending,
    isCategoryFetching,
  );
  const filteredCategories = useMemo(
    () =>
      categories?.filter(
        (c: Category) =>
          c.type === (transactionType as string) &&
          (!c.deletedAt || c.id === watchCategoryId),
      ) || [],
    [categories, transactionType, watchCategoryId],
  );

  const {
    data: assets,
    isPending: isAssetPending,
    isFetching: isAssetFetching,
  } = useAssets();
  const isLoadingAssetList = checkIsLoading(
    mounted,
    isAssetPending,
    isAssetFetching,
  );
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
    setValue("amount", convertDigitsToAmount(digits), {
      shouldValidate: true,
      shouldTouch: true,
    });
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

  const transactionTypeStr = getTypeLabel(transactionType, t);
  const showCategoryList = isCategoryType(transactionType);
  const loadingModalProps = getLoadingModalProps(modalState, isSubmitting);
  const attachmentUrl = removedAttachment ? null : existingTx?.attachmentUrl;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onReset={handleResetForm}
      className={cn(isMoreDetailsOpen && "pb-32")}
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

      <div className="px-4">
        {isTxLoading ? (
          <Skeleton className="w-full h-10 rounded-lg" />
        ) : (
          <Tabs
            value={transactionType}
            onValueChange={(val) => {
              setTransactionType(val as TransactionType);
              clearErrors();
            }}
            className="gap-2"
          >
            <TabsList className="w-full">
              {transactionTypeOptions.map((option) => (
                <TabsTrigger key={option.value} value={option.value}>
                  {option.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContents>
              {transactionTypeOptions.map((option) => (
                <TabsContent
                  key={option.value}
                  value={option.value}
                  className="space-y-4"
                >
                  <section className="flex flex-col items-center gap-1 relative min-h-10 justify-center">
                    {isTxLoading ? (
                      <Skeleton className="w-60 h-10 rounded-lg" />
                    ) : (
                      <>
                        <CurrencyInput
                          id="balance"
                          ref={amountInputRef}
                          value={displayAmount}
                          onChange={handleCurrencyInput}
                        />
                        <input
                          type="hidden"
                          name="amount"
                          value={numericAmount}
                        />
                        {(isSubmitted || Boolean(touchedFields.amount)) &&
                          errors.amount && (
                            <p className="text-expense text-xs">
                              {errors.amount.message}
                            </p>
                          )}
                      </>
                    )}
                  </section>

                  {showCategoryList && (
                    <TransactionCategoryList
                      categories={filteredCategories}
                      activeCategoryId={watchCategoryId || null}
                      onSelectCategory={(id) => setValue("categoryId", id)}
                      onEditClick={handleEditCategoryClick}
                      isLoadingCategoryList={isLoadingCategoryList}
                    />
                  )}

                  <TransactionAssetList
                    assets={safeAssets}
                    activeAssetId={watchAssetId || null}
                    onSelectAsset={(id) => setValue("assetId", id)}
                    activeAssetToId={watchToAssetId || null}
                    onSelectAssetTo={(id) => setValue("toAssetId", id)}
                    transactionType={transactionType}
                    isLoadingAssetList={isLoadingAssetList}
                  />

                  <TransactionMoreDetails
                    isMoreDetailsOpen={isMoreDetailsOpen}
                    setIsMoreDetailsOpen={setIsMoreDetailsOpen}
                    displayDate={displayDate}
                    isCalendarOpen={isCalendarOpen}
                    setIsCalendarOpen={setIsCalendarOpen}
                    isPhotoMenuOpen={isPhotoMenuOpen}
                    setIsPhotoMenuOpen={setIsPhotoMenuOpen}
                    file={file}
                    attachmentUrl={attachmentUrl}
                    onRemoveFile={handleRemoveFile}
                    onTakeAPhoto={handleTakeAPhoto}
                    onSelectAPhoto={handleSelectAPhoto}
                    fileInputRef={fileInputRef}
                    cameraInputRef={cameraInputRef}
                    handleFileChange={handleFileChange}
                    register={register}
                    isLoadingTx={isTxLoading}
                  />
                </TabsContent>
              ))}
            </TabsContents>
          </Tabs>
        )}

        <section className="fixed bottom-16 left-0 right-0 mx-4 pb-4 bg-background pt-2">
          <Button
            variant="unstyled"
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 bg-primary w-full text-white py-3 rounded-xl text-base font-bold capitalize disabled:opacity-50"
          >
            {t("saveTransactionStr").replace("{type}", transactionTypeStr)}
            <ArrowRight size={18} />
          </Button>
        </section>
      </div>

      <ChooseADate
        isOpen={isCalendarOpen}
        selectedDate={tempDate}
        onSelectDate={setTempDate}
        displayMonth={displayMonth}
        onMonthChange={setDisplayMonth}
        onConfirm={handleConfirmDate}
        onClose={() => setIsCalendarOpen(false)}
        onPresetClick={handlePresetClick}
        locale={calendarLocale}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
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
        isOpen={loadingModalProps.isOpen}
        status={loadingModalProps.status}
        message={loadingModalProps.message}
        onClose={handleModalClose}
      />
    </form>
  );
}
