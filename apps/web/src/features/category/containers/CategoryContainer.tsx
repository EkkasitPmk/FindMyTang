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
  useUpdateCategoryMutation,
  useCategories,
  useDeleteCategoryMutation,
} from "../hooks/category.hook";
import { Category } from "../types/category.type";
import CategoryForm from "../components/CategoryForm";

export default function CategoryContainer() {
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

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

  const { mutate: createCategory, isPending: isCreating } =
    useCreateCategoryMutation({
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
          setGlobalError(
            "Failed to create category. Please check your inputs.",
          );
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

  const { mutate: updateCategory, isPending: isUpdating } =
    useUpdateCategoryMutation({
      onSuccess: (data) => {
        toast.success(`Category "${data.name}" updated successfully!`);
        setEditingCategory(null);
        reset({
          name: "",
          type: "EXPENSE",
          color: "",
          icon: "",
        });
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
          setGlobalError(
            "Failed to update category. Please check your inputs.",
          );
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

  const { mutate: deleteCategory, isPending: isDeleting } =
    useDeleteCategoryMutation({
      onSuccess: (data) => {
        toast.success(`Category "${data.name}" deleted successfully!`);
        if (editingCategory?.id === data.id) {
          cancelEdit();
        }
      },
      onError: (err) => {
        const message = err.response?.data?.message;
        const errorMsg = Array.isArray(message)
          ? message[0]
          : message || "Failed to delete category.";
        toast.error(errorMsg);
      },
    });

  const isPending = isCreating || isUpdating || isDeleting;

  const handleDelete = (category: Category) => {
    // ponytail: Uses native confirm dialog to minimize code complexity.
    const confirmed = globalThis.confirm(
      `Are you sure you want to delete category "${category.name}"?`,
    );
    if (confirmed) {
      deleteCategory(category.id);
    }
  };

  const onSubmit = (values: CreateCategoryFormValues) => {
    setGlobalError(null);
    if (editingCategory) {
      updateCategory({
        id: editingCategory.id,
        data: {
          name: values.name.trim(),
          type: values.type,
          color: values.color?.trim() || undefined,
          icon: values.icon?.trim() || undefined,
        },
      });
    } else {
      createCategory({
        name: values.name.trim(),
        type: values.type,
        color: values.color?.trim() || undefined,
        icon: values.icon?.trim() || undefined,
      });
    }
  };

  const startEdit = (category: Category) => {
    setGlobalError(null);
    setEditingCategory(category);
    reset({
      name: category.name,
      type: category.type,
      color: category.color || "",
      icon: category.icon || "",
    });
  };

  const cancelEdit = () => {
    setGlobalError(null);
    setEditingCategory(null);
    reset({
      name: "",
      type: "EXPENSE",
      color: "",
      icon: "",
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
        <div className="p-4 text-on-error-container rounded-lg text-sm">
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
              : "text-error";

          // Safely render color dot or background if valid hex or string
          const hasColor = !!category.color;
          const colorStyle = hasColor
            ? { backgroundColor: category.color }
            : {};

          return (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/65 hover:bg-surface-container-low/20 transition-all duration-200"
            >
              <div className="flex items-center gap-3 justify-between w-full">
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
                    <h4 className="font-semibold text-sm leading-tight">
                      {category.name}
                    </h4>
                    <p className="text-xs text-on-surface-variant/80 mt-1 capitalize font-medium">
                      Type: {category.type === "INCOME" ? "Income" : "Expense"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${typeColor}`}
                  >
                    {category.type}
                  </span>
                  <button
                    onClick={() => startEdit(category)}
                    disabled={isPending}
                    className="px-2 py-1 text-on-surface-variant hover:text-primary hover:bg-primary/8 rounded-lg transition-all text-xs font-medium flex items-center gap-1 cursor-pointer border border-outline/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Edit Category"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    disabled={isPending}
                    className="px-2 py-1 text-on-surface-variant hover:text-error hover:bg-error/8 rounded-lg transition-all text-xs font-medium flex items-center gap-1 cursor-pointer border border-outline/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Category"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Category Creation / Edit Form */}
      <div className="lg:col-span-1">
        <CategoryForm
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          errors={errors}
          isPending={isPending}
          globalError={globalError}
          isEditing={!!editingCategory}
          onCancel={cancelEdit}
        />
      </div>

      {/* Categories List View */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-xl font-bold">Categories List</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Browse and manage your custom income/expense categories.
          </p>
        </div>

        {renderCategoriesList()}
      </div>
    </div>
  );
}
