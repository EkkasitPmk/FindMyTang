"use client";
import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import { CreateIncomeFormValues } from "../schemas/income.schema";
import { Asset } from "@/features/assets/types/assets.type";
import { Category } from "@/features/category/types/category.type";

interface IncomeFormProps {
  register: UseFormRegister<CreateIncomeFormValues>;
  handleSubmit: UseFormHandleSubmit<CreateIncomeFormValues>;
  onSubmit: (values: CreateIncomeFormValues) => void;
  errors: FieldErrors<CreateIncomeFormValues>;
  isPending: boolean;
  globalError: string | null;
  assets: Asset[];
  categories: Category[];
}

export default function IncomeForm({
  register,
  handleSubmit,
  onSubmit,
  errors,
  isPending,
  globalError,
  assets,
  categories,
}: Readonly<IncomeFormProps>) {
  // ponytail: filter income categories only
  const incomeCategories = categories.filter((c) => c.type === "INCOME");

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-surface-container rounded-2xl shadow-xl border border-outline/10 animate-subtle-pop">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-on-surface mb-2">Record Income</h2>
        <p className="text-sm text-on-surface-variant">
          Record a new income and your asset balance will update automatically.
        </p>
      </div>

      {globalError && (
        <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-sm">
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Asset */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="assetId"
            className="text-sm font-semibold text-on-surface-variant"
          >
            Asset
          </label>
          <select
            id="assetId"
            className="w-full h-12 px-4 bg-surface-container-low border border-outline/10 rounded-lg text-on-surface focus:border-primary/35 outline-none transition-all cursor-pointer"
            {...register("assetId")}
          >
            <option value="">Select an asset</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name} (฿{asset.balance.toLocaleString()})
              </option>
            ))}
          </select>
          {errors.assetId && (
            <p className="text-xs text-error font-medium">
              {errors.assetId.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="categoryId"
            className="text-sm font-semibold text-on-surface-variant"
          >
            Category
          </label>
          <select
            id="categoryId"
            className="w-full h-12 px-4 bg-surface-container-low border border-outline/10 rounded-lg text-on-surface focus:border-primary/35 outline-none transition-all cursor-pointer"
            {...register("categoryId")}
          >
            <option value="">Select a category</option>
            {incomeCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon ? `${cat.icon} ` : ""}
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-xs text-error font-medium">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="amount"
            className="text-sm font-semibold text-on-surface-variant"
          >
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="any"
            min="0.01"
            placeholder="0.00"
            className="w-full h-12 px-4 bg-surface-container-low border border-outline/10 rounded-lg text-on-surface focus:border-primary/35 outline-none transition-all"
            {...register("amount", { valueAsNumber: true })}
          />
          {errors.amount && (
            <p className="text-xs text-error font-medium">
              {errors.amount.message}
            </p>
          )}
        </div>

        {/* Note */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="note"
            className="text-sm font-semibold text-on-surface-variant"
          >
            Note (optional)
          </label>
          <input
            id="note"
            type="text"
            placeholder="e.g. Salary, Bonus"
            className="w-full h-12 px-4 bg-surface-container-low border border-outline/10 rounded-lg text-on-surface focus:border-primary/35 outline-none transition-all"
            {...register("note")}
          />
          {errors.note && (
            <p className="text-xs text-error font-medium">
              {errors.note.message}
            </p>
          )}
        </div>

        {/* Transaction Date */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="transactionDate"
            className="text-sm font-semibold text-on-surface-variant"
          >
            Date
          </label>
          <input
            id="transactionDate"
            type="datetime-local"
            className="w-full h-12 px-4 bg-surface-container-low border border-outline/10 rounded-lg text-on-surface focus:border-primary/35 outline-none transition-all"
            {...register("transactionDate")}
          />
          {errors.transactionDate && (
            <p className="text-xs text-error font-medium">
              {errors.transactionDate.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-12 mt-4 bg-secondary text-on-secondary font-semibold rounded-lg flex items-center justify-center hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
        >
          {isPending ? "Saving..." : "Save Income"}
        </button>
      </form>
    </div>
  );
}
