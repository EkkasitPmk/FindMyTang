import {
  UseFormRegister,
  UseFormHandleSubmit,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import {
  CircleMinus,
  CirclePlus,
  Check,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Category } from "@/shared/lib/types/category.type";
import { CreateCategoryFormValues } from "../schemas/category.form.schema";
import { PREMIUM_COLORS } from "../configs/category.config";
import {
  getCategoryIcon,
  SELECTABLE_ICONS,
} from "@/shared/lib/configs/category-icons.config";
import { cn } from "@/shared/lib/utils/core.util";
import { Input } from "@/shared/components/customs/Input";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/shared/components/animate-ui/components/radix/sheet";

interface CUCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSubmit: (values: CreateCategoryFormValues) => void;
  isPending: boolean;
  register: UseFormRegister<CreateCategoryFormValues>;
  handleSubmit: UseFormHandleSubmit<CreateCategoryFormValues>;
  setValue: UseFormSetValue<CreateCategoryFormValues>;
  errors: FieldErrors<CreateCategoryFormValues>;
  customColor: string;
  setCustomColor: (color: string) => void;
  transactionType: "EXPENSE" | "INCOME";
  selectedColor: string;
  selectedIconName: string;
  isDeletedCategory?: boolean;
  onRestore?: () => void;
  onDeletePermanent?: () => void;
}

export default function CUCategoryModal({
  isOpen,
  onClose,
  category,
  onSubmit,
  isPending,
  register,
  handleSubmit,
  setValue,
  errors,
  customColor,
  setCustomColor,
  transactionType,
  selectedColor,
  selectedIconName,
  isDeletedCategory = false,
  onRestore,
  onDeletePermanent,
}: Readonly<CUCategoryModalProps>) {
  const { t } = useTranslation();

  let modalTitle = t("newCategory");
  if (isDeletedCategory) {
    modalTitle = t("deletedCategories");
  } else if (category) {
    modalTitle = t("editCategory");
  }

  const handleCustomColorChange = (color: string) => {
    if (isDeletedCategory) return;
    setCustomColor(color);
    setValue("color", color);
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="bottom"
        className="sm:mx-auto sm:max-w-lg"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>{modalTitle}</SheetTitle>
          <SheetDescription>{t("categoryManagementDesc")}</SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 flex-1 flex flex-col min-h-0"
        >
          <fieldset
            disabled={isDeletedCategory}
            className="space-y-4 overflow-y-auto p-4 mb-0 group-disabled:opacity-80"
          >
            {/* Category Name */}
            <div className="space-y-1">
              <label
                htmlFor="category-name"
                className="text-xs text-muted-foreground font-semibold"
              >
                {t("categoryNameLabel")}
              </label>
              <Input
                id="category-name"
                type="text"
                maxLength={25}
                disabled={isDeletedCategory}
                placeholder={t("egCoffee")}
                error={!!errors.name}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Transaction Type */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-semibold">
                {t("transactionType")}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="unstyled"
                  type="button"
                  disabled={isDeletedCategory}
                  onClick={() =>
                    !isDeletedCategory && setValue("type", "EXPENSE")
                  }
                  className={cn(
                    "grow flex gap-2 items-center justify-center border rounded-md text-center px-2 py-2.5 text-sm font-medium transition-all",
                    isDeletedCategory
                      ? "cursor-default opacity-80"
                      : "cursor-pointer",
                    transactionType === "EXPENSE"
                      ? "border-expense bg-expense/5 text-expense"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  <CircleMinus size={16} />
                  {t("expenses")}
                </Button>
                <Button
                  variant="unstyled"
                  type="button"
                  disabled={isDeletedCategory}
                  onClick={() =>
                    !isDeletedCategory && setValue("type", "INCOME")
                  }
                  className={cn(
                    "grow flex gap-2 items-center justify-center border rounded-md text-center px-2 py-2.5 text-sm font-medium transition-all",
                    isDeletedCategory
                      ? "cursor-default opacity-80"
                      : "cursor-pointer",
                    transactionType === "INCOME"
                      ? "border-income bg-income/5 text-income"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  <CirclePlus size={16} />
                  {t("income")}
                </Button>
              </div>
              {errors.type && (
                <p className="text-xs text-destructive font-medium">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Icon Picker */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-semibold">
                {t("icon")}
              </p>
              <div className="grid grid-cols-6 place-items-center max-h-[15vh] overflow-auto border border-border rounded-md p-1 bg-background">
                {SELECTABLE_ICONS.map((iconName) => {
                  const Icon = getCategoryIcon(iconName);
                  const isSelected = selectedIconName === iconName;
                  return (
                    <Button
                      variant="unstyled"
                      key={iconName}
                      type="button"
                      disabled={isDeletedCategory}
                      onClick={() =>
                        !isDeletedCategory && setValue("icon", iconName)
                      }
                      className={cn(
                        "relative rounded-md transition-all duration-200 border border-transparent overflow-hidden flex items-center justify-center group w-10 h-10",
                        isDeletedCategory ? "cursor-default" : "cursor-pointer",
                        isSelected ? "" : "hover:bg-muted",
                      )}
                    >
                      {isSelected && (
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            backgroundColor: selectedColor,
                            opacity: 0.15,
                          }}
                        />
                      )}
                      <span
                        className={cn(
                          "relative z-10 transition-colors pointer-events-none",
                          isSelected
                            ? ""
                            : "text-muted-foreground group-hover:text-foreground",
                        )}
                        style={
                          isSelected ? { color: selectedColor } : undefined
                        }
                      >
                        <Icon size={18} />
                      </span>
                    </Button>
                  );
                })}
              </div>
              {errors.icon && (
                <p className="text-xs text-destructive">
                  {errors.icon.message}
                </p>
              )}
            </div>

            {/* Color Palette */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground font-semibold">
                  {t("accentColor")}
                </p>
              </div>
              <div className="grid grid-cols-7 gap-2 p-3 max-h-[15vh] overflow-auto bg-surface-secondary/50 rounded-lg border border-border">
                {PREMIUM_COLORS.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <Button
                      variant="unstyled"
                      key={color}
                      type="button"
                      disabled={isDeletedCategory}
                      onClick={() =>
                        !isDeletedCategory && setValue("color", color)
                      }
                      className={cn(
                        "w-8 h-8 mx-auto rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none",
                        isDeletedCategory ? "cursor-default" : "cursor-pointer",
                      )}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    >
                      {isSelected && (
                        <div className="bg-surface/30 rounded-full p-0.5 backdrop-blur-sm shadow-sm">
                          <Check
                            size={16}
                            className="text-white drop-shadow-md"
                          />
                        </div>
                      )}
                    </Button>
                  );
                })}

                <div className="relative w-8 h-8 mx-auto">
                  <Button
                    variant="unstyled"
                    type="button"
                    disabled={isDeletedCategory}
                    className={cn(
                      "w-full h-full rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none",
                      isDeletedCategory ? "cursor-default" : "cursor-pointer",
                    )}
                    style={{
                      backgroundImage:
                        "linear-gradient(45deg, #ff007f, #ff7f00, #ffeb00, #00ff7f, #007fff, #7f00ff, #ff007f)",
                    }}
                    title="Choose custom color"
                  >
                    <div className="w-full h-full rounded-full bg-surface/50 flex items-center justify-center border border-white/20">
                      {selectedColor === customColor ? (
                        <div className="bg-surface/30 rounded-full p-0.5 backdrop-blur-sm shadow-sm">
                          <Check
                            size={16}
                            className="text-white drop-shadow-md"
                          />
                        </div>
                      ) : (
                        <span className="text-sm font-extrabold text-white drop-shadow-sm">
                          +
                        </span>
                      )}
                    </div>
                  </Button>
                  {!isDeletedCategory && (
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full rounded-full pointer-events-auto z-20"
                    />
                  )}
                </div>
              </div>
              {errors.color && (
                <p className="text-xs text-destructive mt-1">
                  {errors.color.message}
                </p>
              )}
            </div>
          </fieldset>

          {isDeletedCategory ? (
            <SheetFooter>
              <Button
                variant="unstyled"
                type="button"
                onClick={onDeletePermanent}
                className="flex-1 bg-destructive hover:bg-destructive/90 text-white rounded-lg py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
                {t("hardDeleteCheckboxLabel")}
              </Button>
              <Button
                variant="unstyled"
                type="button"
                onClick={onRestore}
                className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-lg py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                {t("restoreCategory")}
              </Button>
            </SheetFooter>
          ) : (
            <SheetFooter>
              <SheetClose asChild>
                <Button
                  variant="unstyled"
                  type="button"
                  onClick={onClose}
                  className="w-full border border-border rounded-lg py-2.5 text-sm font-medium hover:bg-surface-secondary transition-colors cursor-pointer text-secondary-text bg-surface shadow-sm"
                >
                  {t("cancel")}
                </Button>
              </SheetClose>
              <Button
                variant="unstyled"
                type="submit"
                disabled={isPending}
                className="w-full text-white rounded-lg py-2.5 text-sm font-medium transition-all shadow-md disabled:opacity-50 cursor-pointer hover:opacity-90 hover:shadow-lg"
                style={{ backgroundColor: selectedColor }}
              >
                {isPending ? t("saving") : t("saveCategory")}
              </Button>
            </SheetFooter>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
}
