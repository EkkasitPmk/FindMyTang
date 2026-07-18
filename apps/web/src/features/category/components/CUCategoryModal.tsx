import {
  UseFormRegister,
  UseFormHandleSubmit,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import { CircleMinus, CirclePlus, Check } from "lucide-react";
import { Category } from "../types/category.type";
import { CreateCategoryFormValues } from "../schemas/category.schema";
import { PREMIUM_COLORS } from "../configs/category.config";
import {
  getCategoryIcon,
  SELECTABLE_ICONS,
} from "@/shared/lib/configs/category-icons.config";
import { cn } from "@/shared/lib/utils/core.util";
import { Input } from "@/shared/components/customs/Input";
import { Button } from "@/shared/components/customs/Button";
import { ModalForm } from "@/shared/components/customs/ModalForm";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

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
}: Readonly<CUCategoryModalProps>) {
  const { t } = useTranslation();

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    setValue("color", color);
  };

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title={category ? t("editCategory") : t("newCategory")}
      onSubmit={handleSubmit(onSubmit)}
      headerClassName="px-6 py-4 border-b border-border bg-surface"
      footerClassName="px-6 py-4 bg-background/50 border-t border-border mt-auto"
      className="max-w-sm rounded-lg"
      footer={
        <>
          <Button
            variant="unstyled"
            type="button"
            onClick={onClose}
            className="w-full border border-border rounded-md py-2 text-sm hover:bg-muted transition-colors cursor-pointer text-foreground bg-background"
          >
            {t("cancel")}
          </Button>
          <Button
            variant="unstyled"
            type="submit"
            disabled={isPending}
            className="w-full text-white rounded-md py-2 text-sm font-medium transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: selectedColor }}
          >
            {isPending ? t("saving") : t("saveCategory")}
          </Button>
        </>
      }
    >
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground font-semibold">
          {t("categoryNameLabel")}
        </p>
        <Input
          type="text"
          placeholder={t("egCoffee")}
          error={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground font-semibold">
          {t("transactionType")}
        </p>
        {/* Select Option Tab */}
        <div className="flex gap-2">
          <Button
            variant="unstyled"
            type="button"
            onClick={() => setValue("type", "EXPENSE")}
            className={cn(
              "grow flex gap-2 items-center justify-center border rounded-md text-center px-2 py-3 text-sm font-medium transition-all cursor-pointer",
              transactionType === "EXPENSE"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            <CircleMinus size={16} />
            {t("expense")}
          </Button>
          <Button
            variant="unstyled"
            type="button"
            onClick={() => setValue("type", "INCOME")}
            className={cn(
              "grow flex gap-2 items-center justify-center border rounded-md text-center px-2 py-3 text-sm font-medium transition-all cursor-pointer",
              transactionType === "INCOME"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            <CirclePlus size={16} />
            {t("income")}
          </Button>
        </div>
        {errors.type && (
          <p className="text-xs text-destructive">{errors.type.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground font-semibold">
          {t("icon")}
        </p>
        <div className="grid grid-cols-6 place-items-center max-h-[16vh] overflow-auto border border-border rounded-md p-1 bg-background">
          {SELECTABLE_ICONS.map((iconName) => {
            const Icon = getCategoryIcon(iconName);
            const isSelected = selectedIconName === iconName;
            return (
              <Button
                variant="unstyled"
                key={iconName}
                type="button"
                onClick={() => setValue("icon", iconName)}
                className={cn(
                  "relative rounded-md transition-all duration-200 border border-transparent overflow-hidden flex items-center justify-center group w-10 h-10 cursor-pointer",
                  isSelected ? "" : "hover:bg-muted",
                )}
              >
                {/* Background tint overlay */}
                {isSelected && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundColor: selectedColor,
                      opacity: 0.15,
                    }}
                  />
                )}

                {/* Icon container */}
                <span
                  className={cn(
                    "relative z-10 transition-colors pointer-events-none",
                    isSelected
                      ? ""
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                  style={isSelected ? { color: selectedColor } : undefined}
                >
                  <Icon size={18} />
                </span>
              </Button>
            );
          })}
        </div>
        {errors.icon && (
          <p className="text-xs text-destructive">{errors.icon.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground font-semibold">
            {t("accentColor")}
          </p>
        </div>
        <div className="grid grid-cols-7 gap-2 p-3 max-h-[16vh] overflow-auto bg-surface-secondary/50 rounded-lg border border-border">
          {PREMIUM_COLORS.map((color) => {
            const isSelected = selectedColor === color;
            return (
              <Button
                variant="unstyled"
                key={color}
                type="button"
                onClick={() => setValue("color", color)}
                className="w-8 h-8 mx-auto rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 focus:outline-none cursor-pointer"
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              >
                {isSelected && (
                  <div className="bg-surface/30 rounded-full p-0.5 backdrop-blur-sm shadow-sm">
                    <Check size={16} className="text-white drop-shadow-md" />
                  </div>
                )}
              </Button>
            );
          })}

          <div className="relative w-8 h-8 mx-auto">
            <Button
              variant="unstyled"
              type="button"
              className="w-full h-full rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 focus:outline-none cursor-pointer"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, #ff007f, #ff7f00, #ffeb00, #00ff7f, #007fff, #7f00ff, #ff007f)",
              }}
              title="Choose custom color"
            >
              <div className="w-full h-full rounded-full bg-surface/50 flex items-center justify-center border border-white/20">
                {selectedColor === customColor ? (
                  <div className="bg-surface/30 rounded-full p-0.5 backdrop-blur-sm shadow-sm">
                    <Check size={16} className="text-white drop-shadow-md" />
                  </div>
                ) : (
                  <span className="text-sm font-extrabold text-white drop-shadow-sm">
                    +
                  </span>
                )}
              </div>
            </Button>
            {/* HTML5 Native Color input laid transparently on top to handle click/tap directly on mobile */}
            <input
              type="color"
              value={customColor}
              onChange={(e) => handleCustomColorChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full rounded-full pointer-events-auto z-20"
            />
          </div>
        </div>
        {errors.color && (
          <p className="text-xs text-destructive mt-1">
            {errors.color.message}
          </p>
        )}
      </div>
    </ModalForm>
  );
}
