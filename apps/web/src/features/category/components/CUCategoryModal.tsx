import {
  UseFormRegister,
  UseFormHandleSubmit,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import { CircleMinus, CirclePlus, X } from "lucide-react";
import { Category } from "../types/category.type";
import { CreateCategoryFormValues } from "../schemas/category.schema";
import { PREMIUM_COLORS } from "../configs/category.config";
import {
  getCategoryIcon,
  SELECTABLE_ICONS,
} from "@/shared/lib/configs/category-icons.config";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/components/customs/Input";

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
  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    setValue("color", color);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-primary-text/20 backdrop-blur-xs transition-opacity duration-300">
      {/* Click outside to close */}
      <div
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative bg-surface border border-border rounded-lg shadow-lg max-w-sm w-full animate-subtle-pop z-10"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <span className="text-lg font-medium">
            {category ? "Edit Category" : "New Category"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-semibold">
              CATEGORY NAME
            </p>
            <Input
              type="text"
              placeholder="e.g. Coffee"
              error={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-error">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-semibold">
              TRANSACTION TYPE
            </p>
            {/* Select Option Tab */}
            <div className="flex gap-2">
              <button
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
                Expense
              </button>
              <button
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
                Income
              </button>
            </div>
            {errors.type && (
              <p className="text-xs text-error">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-semibold">ICON</p>
            <div className="grid grid-cols-6 place-items-center max-h-[18vh] overflow-auto border border-border rounded-md p-1 bg-background">
              {SELECTABLE_ICONS.map((iconName) => {
                const Icon = getCategoryIcon(iconName, transactionType);
                const isSelected = selectedIconName === iconName;
                return (
                  <button
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
                  </button>
                );
              })}
            </div>
            {errors.icon && (
              <p className="text-xs text-error">{errors.icon.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground font-semibold">
                ACCENT COLOR
              </p>
            </div>
            <div className="grid grid-cols-6 place-items-center max-h-[18vh] overflow-auto py-2 gap-y-2 bg-muted/5 rounded-md">
              {PREMIUM_COLORS.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setValue("color", color)}
                    className={cn(
                      "relative w-8 h-8 rounded-full transition-all duration-200 cursor-pointer overflow-hidden border-2",
                      isSelected
                        ? "scale-110 shadow-md border-solid"
                        : "hover:scale-105 border-transparent",
                    )}
                    style={{
                      borderColor: isSelected ? "black" : "transparent",
                      backgroundColor: isSelected ? "transparent" : color,
                    }}
                  >
                    {/* Inner color tint overlay (30% opacity) */}
                    {isSelected && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ backgroundColor: color }}
                      />
                    )}
                  </button>
                );
              })}

              <div className="relative">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full p-0.5 transition-all duration-200 flex items-center justify-center relative",
                    selectedColor === customColor
                      ? "scale-110 shadow-md"
                      : "hover:scale-105",
                  )}
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, #ff007f, #ff7f00, #ffeb00, #00ff7f, #007fff, #7f00ff, #ff007f)",
                  }}
                  title="Choose custom color"
                >
                  <div className="w-full h-full rounded-full bg-surface flex items-center justify-center relative overflow-hidden pointer-events-none border border-border/20">
                    {/* Inner color tint overlay (30% opacity) when selected */}
                    {selectedColor === customColor && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ backgroundColor: customColor, opacity: 0.3 }}
                      />
                    )}
                    <span
                      className="relative z-10 text-sm font-extrabold"
                      style={{
                        color:
                          selectedColor === customColor
                            ? customColor
                            : "#888888",
                      }}
                    >
                      +
                    </span>
                  </div>
                  {/* HTML5 Native Color input laid transparently on top to handle click/tap directly on mobile */}
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full rounded-full pointer-events-auto z-20"
                  />
                </div>
              </div>
            </div>
            {errors.color && (
              <p className="text-xs text-error mt-1">{errors.color.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 px-6 py-4 bg-background/50 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="w-full border border-border rounded-md py-2 text-sm hover:bg-muted transition-colors cursor-pointer text-foreground bg-background"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="w-full text-white rounded-md py-2 text-sm font-medium transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: selectedColor }}
          >
            {isPending ? "Saving..." : "Save Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
