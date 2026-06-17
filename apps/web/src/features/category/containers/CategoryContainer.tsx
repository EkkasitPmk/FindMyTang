"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  createCategorySchema,
  CreateCategoryFormValues,
} from "../schemas/category.schema";
import {
  useCreateCategoryMutation,
  useCategories,
} from "../hooks/category.hook";
import CategoryForm from "../components/CategoryForm";

export default function CategoryContainer() {
  const [globalError, setGlobalError] = useState<string | null>(null);

  const { data: categories, isLoading, error } = useCategories();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      type: "EXPENSE",
      color: "",
      icon: "",
    },
  });

  const { mutate: createCategory, isPending } = useCreateCategoryMutation({
    onSuccess: (data) => {
      toast.success(`Category "${data.name}" created successfully!`);
      reset();
    },
    onError: (err) => {
      const message = err.response?.data?.message;
      let errorList: string[] = [];
      if (Array.isArray(message)) {
        errorList = message;
      } else if (message) {
        errorList = [message];
      }

      if (errorList.length === 0) {
        setGlobalError("Failed to create category. Please check your inputs.");
        return;
      }

      let hasGlobalError = false;
      errorList.forEach((msg) => {
        const lowerMsg = msg.toLowerCase();
        if (lowerMsg.includes("name")) {
          setError("name", { type: "server", message: msg });
        } else if (lowerMsg.includes("type")) {
          setError("type", { type: "server", message: msg });
        } else if (lowerMsg.includes("color")) {
          setError("color", { type: "server", message: msg });
        } else if (lowerMsg.includes("icon")) {
          setError("icon", { type: "server", message: msg });
        } else {
          setGlobalError(msg);
          hasGlobalError = true;
        }
      });

      if (!hasGlobalError) {
        setGlobalError(null);
      }
    },
  });

  const onSubmit = (values: CreateCategoryFormValues) => {
    setGlobalError(null);
    createCategory({
      name: values.name.trim(),
      type: values.type,
      color: values.color?.trim() || undefined,
      icon: values.icon?.trim() || undefined,
    });
  };

  const renderCategoriesList = () => {
    if (isLoading) {
      return (
        <div className="py-6 text-on-surface-variant animate-pulse">
          Loading categories...
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 bg-error-container text-on-error-container rounded-lg text-sm">
          Error loading categories: {error.message || "Unknown error"}
        </div>
      );
    }

    if (!categories || categories.length === 0) {
      return (
        <div className="p-8 border border-dashed border-outline-variant/60 rounded-xl text-center text-on-surface-variant">
          No custom categories created yet. Use the form to add one!
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => {
          const typeColor =
            category.type === "INCOME"
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : "bg-error-container/8 text-error border-error-container/15";

          // Safely render color dot or background if valid hex or string
          const hasColor = !!category.color;
          const colorStyle = hasColor
            ? { backgroundColor: category.color }
            : {};

          return (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/65 bg-surface-container-lowest hover:bg-surface-container-low/20 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                {/* Color chip representation */}
                <div
                  style={colorStyle}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                    hasColor
                      ? "text-white"
                      : "bg-primary-container/8 text-primary"
                  }`}
                >
                  {category.icon
                    ? category.icon.substring(0, 2).toUpperCase()
                    : category.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-on-surface leading-tight">
                    {category.name}
                  </h4>
                  <p className="text-[10px] text-on-surface-variant/80 mt-1 uppercase tracking-wider font-semibold">
                    {category.icon || "no-icon"}
                  </p>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${typeColor}`}
              >
                {category.type}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Category Creation Form */}
      <div className="lg:col-span-1">
        <CategoryForm
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          errors={errors}
          isPending={isPending}
          globalError={globalError}
        />
      </div>

      {/* Categories List View */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Categories List</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Browse and manage your custom income/expense categories.
          </p>
        </div>

        {renderCategoriesList()}
      </div>
    </div>
  );
}
