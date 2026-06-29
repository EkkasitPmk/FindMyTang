import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import { CreateAssetFormValues } from "../schemas/assets.schema";
import { Check, X, Tag } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { getAssetIcon } from "../utils/assets.util";
import { AssetType } from "../types/assets.type";
import { Input } from "@/shared/components/customs/Input";
import { Button } from "@/shared/components/customs/Button";

const ASSET_COLORS = [
  "#2563EB", // Primary
  "#16A34A", // Income / Success
  "#DC2626", // Expense / Danger
  "#7C3AED", // Transfer
  "#F59E0B", // Investment / Warning
  "#0EA5E9", // Info
  "#EA580C", // Accent
];

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
  let submitButtonText = "Create Asset";
  if (isPending) {
    submitButtonText = "Saving...";
  } else if (isEdit) {
    submitButtonText = "Save Changes";
  }

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
        className="relative bg-surface border border-border rounded-xl shadow-2xl max-w-sm w-full animate-subtle-pop z-10 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gray-50/50">
          <div className="text-lg font-medium">
            <h2 className="text-xl font-bold">
              {isEdit ? "Edit Asset" : "Create New Asset"}
            </h2>
          </div>
          <Button
            variant="unstyled"
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-4 space-y-4 overflow-y-auto custom-scrollbar">
          <p className="text-sm text-on-surface-variant">
            {isEdit
              ? "Update your financial account or wallet details."
              : "Add a new financial account or wallet to track your balance."}
          </p>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-on-surface-variant"
            >
              Asset Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Tag size={18} className="text-gray-400" />
              </div>
              <Input
                id="name"
                type="text"
                placeholder="e.g. Cash, Main Bank"
                className="pl-10"
                error={!!errors.name}
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-error font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5 relative">
            <label
              htmlFor="type"
              className="text-sm font-semibold text-on-surface-variant"
            >
              Asset Type
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
                    : "border-outline/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
                )}
              >
                <span className="font-medium text-gray-700">{selected}</span>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-0 text-primary" : "-rotate-90 text-gray-400"}`}
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
              <ul className="absolute top-19 w-full bg-white border border-gray-200 rounded-lg shadow-xl py-1.5 z-20 max-h-52 overflow-y-auto animate-in fade-in zoom-in-95">
                {assetTypeList.map((type) => (
                  <li key={type}>
                    <Button
                      variant="unstyled"
                      type="button"
                      className={cn(
                        "w-full px-4 py-2.5 text-sm flex items-center justify-between hover:bg-gray-50 cursor-pointer text-left transition-colors",
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
                        <span>{type}</span>
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
              <p className="text-xs text-error font-medium">
                {errors.type.message}
              </p>
            )}
          </div>

          {/* Balance */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="balance"
              className="text-sm font-semibold text-on-surface-variant"
            >
              {isEdit ? "Current Balance" : "Initial Balance"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="font-semibold text-gray-400">฿</span>
              </div>
              <Input
                id="balance"
                type="number"
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
              <p className="text-xs text-error font-medium">
                {errors.balance.message}
              </p>
            )}
          </div>

          {/* Color Selection */}
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-on-surface-variant flex items-center justify-between">
              Theme Color
            </p>
            <div className="grid grid-cols-7 gap-2 p-3 bg-gray-50/50 rounded-lg border border-gray-100">
              {ASSET_COLORS.map((color) => (
                <Button
                  variant="unstyled"
                  key={color}
                  type="button"
                  onClick={() => onSelectColor?.(color)}
                  className="w-8 h-8 mx-auto rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                >
                  {currentColor === color && (
                    <div className="bg-white/30 rounded-full p-0.5 backdrop-blur-sm shadow-sm">
                      <Check size={16} className="text-white drop-shadow-md" />
                    </div>
                  )}
                </Button>
              ))}
            </div>
            {/* hidden input for form registration */}
            <input type="hidden" {...register("color")} />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 px-6 py-4 bg-gray-50/80 border-t border-border mt-auto">
          <Button
            variant="unstyled"
            type="button"
            onClick={onClose}
            className="w-full border border-gray-300 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer text-gray-700 bg-white shadow-sm"
          >
            Cancel
          </Button>
          <Button
            variant="unstyled"
            type="submit"
            disabled={isPending}
            className="w-full text-white rounded-lg py-2.5 text-sm font-medium transition-all shadow-md disabled:opacity-50 cursor-pointer bg-primary hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]"
          >
            {submitButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
}
