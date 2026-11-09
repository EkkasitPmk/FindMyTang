import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import { useRef } from "react";
import { CreateAssetFormValues } from "../schemas/assets.form.schema";
import { Check, Tag } from "lucide-react";
import { cn } from "@/shared/lib/utils/core.util";
import { getAssetIcon } from "@/shared/components/customs/AssetIcon";
import { AssetType } from "@/shared/lib/types/asset.type";
import { Input } from "@/shared/components/customs/Input";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { ASSET_COLORS } from "../configs/assets.config";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { TranslationKey } from "@/shared/lib/configs/translations.config";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/shared/components/animate-ui/components/radix/sheet";
import { useIsMobile } from "@/shared/lib/hooks/use-mobile";

interface AssetFormProps {
  register: UseFormRegister<CreateAssetFormValues>;
  handleSubmit: UseFormHandleSubmit<CreateAssetFormValues>;
  onSubmit: (values: CreateAssetFormValues) => void;
  errors: FieldErrors<CreateAssetFormValues>;
  isPending: boolean;
  selected: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  assetTypeList: string[];
  handleSelect: (type: string) => void;
  onClose?: () => void;
  currentColor?: string;
  onSelectColor?: (color: string) => void;
  onBlurBalance?: () => void;
  isEdit?: boolean;
  includeInSnapshot?: boolean;
  onToggleIncludeInSnapshot?: (value: boolean) => void;
  onBlurSavingsAmount?: () => void;
  onQuickSetSavings?: (type: "half" | "full" | "clear") => void;
}

export default function AssetForm({
  register,
  handleSubmit,
  onSubmit,
  errors,
  isPending,
  selected,
  isOpen,
  setIsOpen,
  assetTypeList,
  handleSelect,
  onClose,
  currentColor = "#2563EB",
  onSelectColor,
  onBlurBalance,
  isEdit = false,
  includeInSnapshot = true,
  onToggleIncludeInSnapshot,
  onBlurSavingsAmount,
  onQuickSetSavings,
}: Readonly<AssetFormProps>) {
  const { t } = useTranslation();
  const nameField = register("name");
  const balanceField = register("balance");
  const savingsAmountField = register("savingsAmount");
  const previousBalanceRef = useRef("");
  const previousSavingsAmountRef = useRef("");

  let submitButtonText = t("createAsset");
  if (isPending) {
    submitButtonText = t("saving");
  } else if (isEdit) {
    submitButtonText = t("saveChanges");
  }

  const isMobile = useIsMobile();

  return (
    <Sheet open={true} onOpenChange={(open) => !open && onClose?.()}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="sm:mx-auto sm:max-w-lg"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>
            {isEdit ? t("editAsset") : t("createNewAsset")}
          </SheetTitle>
          <SheetDescription>
            {isEdit ? t("updateAssetDesc") : t("createAssetDesc")}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 flex-1 flex flex-col min-h-0"
        >
          <div className="space-y-4 overflow-y-auto sm:overflow-y-visible custom-scrollbar p-4 m-0">
            {/* Type */}
            <div className="flex flex-col gap-1.5 relative">
              <label
                htmlFor="type"
                className="text-sm font-semibold text-secondary-text"
              >
                {t("assetType")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                  {getAssetIcon(selected as AssetType, currentColor, 18)}
                </div>
                <Button
                  variant="unstyled"
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className={cn(
                    "w-full h-12 pl-10 pr-4 text-left bg-background border rounded-lg outline-none transition-all cursor-pointer flex items-center justify-between",
                    errors.type
                      ? "border-error focus:border-error"
                      : "border-border/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
                  )}
                >
                  <span className="font-medium text-secondary-text">
                    {t(`assetType${selected}` as TranslationKey)}
                  </span>
                  <svg
                    aria-hidden="true"
                    className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-0 text-primary" : "-rotate-90 text-disabled-text"}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Button>
              </div>
              {isOpen && (
                <ul className="absolute top-19 w-full bg-surface border border-border rounded-lg shadow-xl py-1.5 z-20 overflow-y-auto animate-in fade-in zoom-in-95">
                  {assetTypeList.map((type) => (
                    <li key={type}>
                      <Button
                        variant="unstyled"
                        type="button"
                        className={cn(
                          "w-full px-4 py-2.5 text-sm flex items-center justify-between hover:bg-surface-secondary cursor-pointer text-left transition-colors",
                          selected === type &&
                            "bg-primary/5 text-primary font-medium",
                        )}
                        onClick={() => handleSelect(type)}
                      >
                        <div className="flex items-center gap-2">
                          {getAssetIcon(
                            type as AssetType,
                            selected === type ? currentColor : undefined,
                            16,
                          )}
                          <span>{t(`assetType${type}` as TranslationKey)}</span>
                        </div>
                        {selected === type && (
                          <Check size={16} className="text-primary" />
                        )}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}

              {errors.type && (
                <p className="text-xs text-destructive font-medium">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-secondary-text"
              >
                {t("assetName")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Tag size={18} className="text-disabled-text" />
                </div>
                <Input
                  id="name"
                  type="text"
                  maxLength={30}
                  placeholder={t("assetNamePlaceholder")}
                  className="pl-10"
                  error={!!errors.name}
                  {...nameField}
                  onChange={(e) => {
                    e.currentTarget.value = e.currentTarget.value.slice(0, 30);
                    void nameField.onChange(e);
                  }}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-destructive font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Balance */}
            {!isEdit && (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="balance"
                  className="text-sm font-semibold text-secondary-text"
                >
                  {t("initialBalance")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="font-semibold text-disabled-text">฿</span>
                  </div>
                  <Input
                    id="balance"
                    type="text"
                    inputMode="decimal"
                    min={1}
                    max={99999999.99}
                    step="any"
                    placeholder="0.00"
                    className="pl-9 font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    error={!!errors.balance}
                    {...balanceField}
                    onFocus={(e) => {
                      const value = e.currentTarget.value.replaceAll(",", "");
                      if (Number(value) === 0) {
                        e.currentTarget.value = "";
                        previousBalanceRef.current = "";
                        void balanceField.onChange(e);
                      } else {
                        e.currentTarget.value = value;
                        previousBalanceRef.current = value;
                      }
                    }}
                    onChange={(e) => {
                      const value = e.currentTarget.value.replaceAll(",", "");
                      e.currentTarget.value = value;
                      if (value && Number(value) > 99999999.99) {
                        e.currentTarget.value = previousBalanceRef.current;
                      } else {
                        previousBalanceRef.current = value;
                      }
                      void balanceField.onChange(e);
                    }}
                    onBlur={(e) => {
                      void balanceField.onBlur(e);
                      onBlurBalance?.();
                      const value = e.currentTarget.value.replaceAll(",", "");
                      if (value && !Number.isNaN(Number(value))) {
                        e.currentTarget.value = Number(value).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        );
                      }
                    }}
                  />
                </div>
                {errors.balance && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.balance.message}
                  </p>
                )}
              </div>
            )}

            {/* Color Selection */}
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-secondary-text flex items-center justify-between">
                {t("themeColor")}
              </p>
              <div className="grid grid-cols-7 gap-2 p-3 bg-surface-secondary/50 rounded-lg border border-border">
                {ASSET_COLORS.map((color) => (
                  <Button
                    variant="unstyled"
                    key={color}
                    type="button"
                    onClick={() => onSelectColor?.(color)}
                    className="w-8 h-8 mx-auto rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  >
                    {currentColor === color && (
                      <div className="bg-surface/30 rounded-full p-0.5 backdrop-blur-sm shadow-sm">
                        <Check
                          size={16}
                          className="text-white drop-shadow-md"
                        />
                      </div>
                    )}
                  </Button>
                ))}
              </div>
              <input type="hidden" {...register("color")} />
            </div>

            {/* Include in Financial Snapshot Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-surface-secondary/40 rounded-xl border border-border">
              <div className="flex flex-col gap-0.5 pr-3">
                <span className="text-sm font-semibold text-primary-text">
                  {t("includeInSnapshot")}
                </span>
                <span className="text-xs text-secondary-text leading-relaxed">
                  {t("includeInSnapshotDesc")}
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={includeInSnapshot}
                onClick={() => onToggleIncludeInSnapshot?.(!includeInSnapshot)}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20",
                  includeInSnapshot ? "bg-primary" : "bg-border",
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                    includeInSnapshot ? "translate-x-5" : "translate-x-0",
                  )}
                />
              </button>
            </div>

            {/* Savings Split Section */}
            {includeInSnapshot && (
              <div className="flex flex-col gap-2 p-3.5 bg-surface-secondary/40 rounded-xl border border-border">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-primary-text">
                    {t("savingsSplit")}
                  </span>
                  <span className="text-xs text-secondary-text leading-relaxed">
                    {t("savingsAmountDesc")}
                  </span>
                </div>

                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-disabled-text font-medium text-sm">
                    ฿
                  </div>
                  <Input
                    id="savingsAmount"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    className="pl-8 text-primary-text font-medium text-sm bg-background"
                    {...savingsAmountField}
                    onFocus={(e) => {
                      const value = e.currentTarget.value.replaceAll(",", "");
                      if (Number(value) === 0) {
                        e.currentTarget.value = "";
                        previousSavingsAmountRef.current = "";
                        void savingsAmountField.onChange(e);
                      } else {
                        e.currentTarget.value = value;
                        previousSavingsAmountRef.current = value;
                      }
                    }}
                    onChange={(e) => {
                      const value = e.currentTarget.value.replaceAll(",", "");
                      e.currentTarget.value = value;
                      if (value && Number(value) > 99999999.99) {
                        e.currentTarget.value =
                          previousSavingsAmountRef.current;
                      } else {
                        previousSavingsAmountRef.current = value;
                      }
                      void savingsAmountField.onChange(e);
                    }}
                    onBlur={(e) => {
                      void savingsAmountField.onBlur(e);
                      onBlurSavingsAmount?.();
                      const value = e.currentTarget.value.replaceAll(",", "");
                      if (value && !Number.isNaN(Number(value))) {
                        e.currentTarget.value = Number(value).toFixed(2);
                      } else {
                        e.currentTarget.value = "0.00";
                      }
                    }}
                  />
                </div>
                {errors.savingsAmount && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.savingsAmount.message}
                  </p>
                )}

                {/* Quick Preset Buttons */}
                <div className="flex items-center gap-1.5 pt-1">
                  <Button
                    variant="unstyled"
                    type="button"
                    onClick={() => onQuickSetSavings?.("half")}
                    className="px-2.5 py-1 text-xs rounded-md border border-border/80 bg-surface hover:bg-surface-secondary text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                  >
                    {t("halfBalance")}
                  </Button>
                  <Button
                    variant="unstyled"
                    type="button"
                    onClick={() => onQuickSetSavings?.("full")}
                    className="px-2.5 py-1 text-xs rounded-md border border-border/80 bg-surface hover:bg-surface-secondary text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                  >
                    {t("fullBalance")}
                  </Button>
                  <Button
                    variant="unstyled"
                    type="button"
                    onClick={() => onQuickSetSavings?.("clear")}
                    className="px-2.5 py-1 text-xs rounded-md border border-border/80 bg-surface hover:bg-surface-secondary text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                  >
                    {t("clearSavings")}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button
                variant="unstyled"
                type="button"
                onClick={() => onClose?.()}
                className="w-full border border-border rounded-lg py-2.5 text-sm font-medium hover:bg-surface-secondary transition-colors cursor-pointer text-secondary-text bg-surface shadow-sm"
              >
                {t("cancel")}
              </Button>
            </SheetClose>
            <Button
              variant="unstyled"
              type="submit"
              disabled={isPending}
              style={{ backgroundColor: currentColor }}
              className="w-full text-white rounded-lg py-2.5 text-sm font-medium transition-all shadow-md disabled:opacity-50 cursor-pointer hover:opacity-90 hover:shadow-lg"
            >
              {submitButtonText}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
