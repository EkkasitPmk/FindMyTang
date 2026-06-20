import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import { CreateCategoryFormValues } from "../schemas/category.schema";

interface CategoryFormProps {
  register: UseFormRegister<CreateCategoryFormValues>;
  handleSubmit: UseFormHandleSubmit<CreateCategoryFormValues>;
  onSubmit: (values: CreateCategoryFormValues) => void;
  errors: FieldErrors<CreateCategoryFormValues>;
  isPending: boolean;
  globalError: string | null;
  isEditing?: boolean;
  onCancel?: () => void;
}

export default function CategoryForm({
  register,
  handleSubmit,
  onSubmit,
  errors,
  isPending,
  globalError,
  isEditing = false,
  onCancel,
}: Readonly<CategoryFormProps>) {
  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl shadow-xl border border-outline/10 animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">
          {isEditing ? "Edit Category" : "Create New Category"}
        </h2>
        <p className="text-sm text-on-surface-variant">
          {isEditing
            ? "Update your category details below."
            : "Add a category to organize your income and expenses."}
        </p>
      </div>

      {globalError && (
        <div className="mb-4 p-3 text-on-error-container rounded-lg text-sm">
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="text-sm font-semibold text-on-surface-variant"
          >
            Category Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Food & Drinks, Salary, Shopping"
            className="w-full h-12 px-4 border border-outline/10 rounded-lg focus:border-primary/35 outline-none transition-all"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-error font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Type */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="type"
            className="text-sm font-semibold text-on-surface-variant"
          >
            Category Type
          </label>
          <select
            id="type"
            className="w-full h-12 px-4 border border-outline/10 rounded-lg focus:border-primary/35 outline-none transition-all cursor-pointer"
            {...register("type")}
          >
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
          {errors.type && (
            <p className="text-xs text-error font-medium">
              {errors.type.message}
            </p>
          )}
        </div>

        {/* Color */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="color"
            className="text-sm font-semibold text-on-surface-variant"
          >
            Color (Hex Code)
          </label>
          <input
            id="color"
            type="text"
            placeholder="e.g. #FF5733, #33FF57"
            className="w-full h-12 px-4 border border-outline/10 rounded-lg focus:border-primary/35 outline-none transition-all"
            {...register("color")}
          />
          {errors.color && (
            <p className="text-xs text-error font-medium">
              {errors.color.message}
            </p>
          )}
        </div>

        {/* Icon */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="icon"
            className="text-sm font-semibold text-on-surface-variant"
          >
            Icon Identifier
          </label>
          <input
            id="icon"
            type="text"
            placeholder="e.g. food-icon, salary-icon"
            className="w-full h-12 px-4 border border-outline/10 rounded-lg focus:border-primary/35 outline-none transition-all"
            {...register("icon")}
          />
          {errors.icon && (
            <p className="text-xs text-error font-medium">
              {errors.icon.message}
            </p>
          )}
        </div>

        {/* Submit & Cancel */}
        <div className="flex flex-col gap-2 mt-4">
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-primary text-white font-semibold rounded-lg flex items-center justify-center hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            {isPending
              ? "Saving Category..."
              : isEditing
                ? "Save Changes"
                : "Save"}
          </button>

          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full h-12 font-semibold rounded-lg flex items-center justify-center hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer border border-outline/10"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
