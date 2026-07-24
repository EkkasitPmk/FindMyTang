import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
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
}: Readonly<AssetFormProps>) {
  const { t } = useTranslation();

  let submitButtonText = t("createAsset");
  if (isPending) {
    submitButtonText = t("saving");
  } else if (isEdit) {
    submitButtonText = t("saveChanges");
  }

  return (
    <Sheet
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose?.();
      }}
    >
      <SheetContent
        side="bottom"
        className="h-auto max-h-[80vh] rounded-t-2xl sm:max-w-lg sm:mx-auto border-border bg-surface p-4 shadow-2xl overflow-y-auto custom-scrollbar flex flex-col gap-2"
      >
        <SheetHeader className="text-left pb-1 px-0">
          <SheetTitle className="text-xl font-bold text-foreground">
            {isEdit ? t("editAsset") : t("createNewAsset")}
          </SheetTitle>
          <SheetDescription className="text-sm text-secondary-text">
            {isEdit ? t("updateAssetDesc") : t("createAssetDesc")}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 flex-1 flex flex-col min-h-0"
        >
          <div className="space-y-4 overflow-y-auto custom-scrollbar px-1">
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
                <ul className="absolute top-19 w-full bg-surface border border-border rounded-lg shadow-xl py-1.5 z-20 max-h-52 overflow-y-auto animate-in fade-in zoom-in-95">
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
                  placeholder={t("assetNamePlaceholder")}
                  className="pl-10"
                  error={!!errors.name}
                  {...register("name")}
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
                    type="number"
                    inputMode="decimal"
                    step="any"
                    placeholder="0.00"
                    className="pl-9 font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    error={!!errors.balance}
                    {...register("balance")}
                    onBlur={(e) => {
                      void register("balance").onBlur(e);
                      onBlurBalance?.();
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
          </div>

          <SheetFooter className="px-4 py-2 flex-row gap-3">
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
