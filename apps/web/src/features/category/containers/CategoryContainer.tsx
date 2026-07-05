"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCategorySchema,
  CreateCategoryFormValues,
} from "../schemas/category.schema";
import { PREMIUM_COLORS } from "../configs/category.config";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useCategories,
  useDeleteCategoryMutation,
  useCategoryUIStore,
  useReorderCategoriesMutation,
  ApiErrorResponse,
} from "../hooks/category.hook";
import { Category } from "../types/category.type";
import { CircleX } from "lucide-react";
import ConfirmModal from "@/shared/components/customs/ConfirmModal";
import CUCategoryModal from "../components/CUCategoryModal";
import LoadingModal from "@/shared/components/customs/LoadingModal";
import CategoryGrid from "../components/CategoryGrid";
import { AxiosError } from "axios";
import { Button } from "@/shared/components/customs/Button";

export default function CategoryContainer() {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [isCUModalOpen, setIsCUModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      type: "EXPENSE",
      color: PREMIUM_COLORS[0],
      icon: "food",
    },
  });
  const [customColor, setCustomColor] = useState<string>("#e11d48");
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const [prevCategory, setPrevCategory] = useState<Category | null>(null);

  // Sync state with editing category when opened or edited category changes (Render Phase Sync)
  if (isCUModalOpen !== prevIsOpen || editingCategory !== prevCategory) {
    setPrevIsOpen(isCUModalOpen);
    setPrevCategory(editingCategory);
    if (isCUModalOpen) {
      if (
        editingCategory?.color &&
        !PREMIUM_COLORS.includes(editingCategory.color)
      ) {
        setCustomColor(editingCategory.color);
      } else {
        setCustomColor("#e11d48");
      }
    }
  }
  const transactionType = useWatch({ control, name: "type" }) || "EXPENSE";
  const selectedColor =
    useWatch({ control, name: "color" }) || PREMIUM_COLORS[0];
  const selectedIconName = useWatch({ control, name: "icon" }) || "food";

  useEffect(() => {
    if (isCUModalOpen) {
      if (editingCategory) {
        const normalizedIcon = editingCategory.icon || "food";

        reset({
          name: editingCategory.name,
          type: editingCategory.type,
          color: editingCategory.color || PREMIUM_COLORS[0],
          icon: normalizedIcon,
        });
      } else {
        reset({
          name: "",
          type: "EXPENSE",
          color: PREMIUM_COLORS[0],
          icon: "food",
        });
      }
    }
  }, [editingCategory, isCUModalOpen, reset]);

  const isEditingList = useCategoryUIStore((state) => state.isEditingList);
  const setEditingList = useCategoryUIStore((state) => state.setEditingList);

  useEffect(() => {
    return () => {
      setEditingList(false);
    };
  }, [setEditingList]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const { data: categories, isPending, isFetching } = useCategories();
  const isCategoriesLoading = !mounted || isPending || isFetching;

  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [prevCategories, setPrevCategories] = useState<Category[] | undefined>(
    undefined,
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (categories !== prevCategories) {
    setPrevCategories(categories);
    if (categories) {
      const sorted = [...categories].sort((a, b) => {
        const orderA = a.displayOrder ?? 0;
        const orderB = b.displayOrder ?? 0;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
      setLocalCategories(sorted);
    } else {
      setLocalCategories([]);
    }
  }

  const { mutate: reorderCategories } = useReorderCategoriesMutation({
    onError: () => {
      toast.error("Failed to update category order.");
    },
  });

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const currentTabCategories = localCategories.filter(
      (c) => c.type === activeTab,
    );
    const updatedTabCategories = [...currentTabCategories];
    const [draggedItem] = updatedTabCategories.splice(draggedIndex, 1);
    updatedTabCategories.splice(index, 0, draggedItem);

    const otherTabCategories = localCategories.filter(
      (c) => c.type !== activeTab,
    );
    setLocalCategories([...updatedTabCategories, ...otherTabCategories]);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    const currentTabCategories = localCategories.filter(
      (c) => c.type === activeTab,
    );
    const ids = currentTabCategories.map((c) => c.id);
    reorderCategories(ids);
  };

  const handleTouchStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggedIndex === null) return;
    const touch = e.touches[0];
    if (!touch) return;

    const elementUnderTouch = document.elementFromPoint(
      touch.clientX,
      touch.clientY,
    );
    if (!elementUnderTouch) return;

    const itemElement = elementUnderTouch.closest(
      "[data-index]",
    ) as HTMLElement | null;
    if (!itemElement) return;

    const targetIndexAttr = itemElement.dataset.index;
    if (targetIndexAttr === undefined) return;

    const targetIndex = Number.parseInt(targetIndexAttr, 10);
    if (Number.isNaN(targetIndex) || draggedIndex === targetIndex) return;

    const currentTabCategories = localCategories.filter(
      (c) => c.type === activeTab,
    );
    const updatedTabCategories = [...currentTabCategories];
    const [draggedItem] = updatedTabCategories.splice(draggedIndex, 1);
    updatedTabCategories.splice(targetIndex, 0, draggedItem);

    const otherTabCategories = localCategories.filter(
      (c) => c.type !== activeTab,
    );
    setLocalCategories([...updatedTabCategories, ...otherTabCategories]);
    setDraggedIndex(targetIndex);
  };

  const handleTouchEnd = () => {
    if (draggedIndex === null) return;
    handleDragEnd();
  };

  const { mutate: createCategory, isPending: isCreating } =
    useCreateCategoryMutation({
      onSuccess: (data) => {
        toast.success(`Category "${data.name}" created successfully!`);
        setIsCUModalOpen(false);
      },
    });

  const { mutate: updateCategory, isPending: isUpdating } =
    useUpdateCategoryMutation({
      onSuccess: (data) => {
        toast.success(`Category "${data.name}" updated successfully!`);
        setEditingCategory(null);
        setIsCUModalOpen(false);
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

  const handleDelete = (category: Category) => {
    // ponytail: Sets category state to open custom ConfirmModal.
    setCategoryToDelete(category);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
    }
  };

  const onSubmit = (values: CreateCategoryFormValues) => {
    const mutationOptions = {
      onError: (err: AxiosError<ApiErrorResponse>) => {
        const message = err.response?.data?.message;
        let errorList: string[] = [];
        if (Array.isArray(message)) {
          errorList = message;
        } else if (message) {
          errorList = [message];
        }

        if (errorList.length === 0) {
          toast.error("Failed to save category. Please check your inputs.");
          return;
        }

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
            toast.error(msg);
          }
        });
      },
    };

    if (editingCategory) {
      updateCategory(
        {
          id: editingCategory.id,
          data: {
            name: values.name.trim(),
            type: values.type,
            color: values.color?.trim() || undefined,
            icon: values.icon?.trim() || undefined,
          },
        },
        mutationOptions,
      );
    } else {
      createCategory(
        {
          name: values.name.trim(),
          type: values.type,
          color: values.color?.trim() || undefined,
          icon: values.icon?.trim() || undefined,
        },
        mutationOptions,
      );
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
  };

  const filteredCategories =
    localCategories.filter((category) => category.type === activeTab) || [];

  return (
    <div className="space-y-2 px-4">
      <div className="mb-2">
        <h2 className="text-xl font-bold">Category Management</h2>
        <p className="text-sm">Organize your financial flows with precision.</p>
      </div>

      {/* Select Option Tab */}
      <div className="flex border-b border-outline/10 mb-1 cursor-pointer">
        <Button
          variant="unstyled"
          type="button"
          onClick={() => setActiveTab("EXPENSE")}
          className={`grow text-center py-2 text-base font-medium border-b-2 ${
            activeTab === "EXPENSE"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Expenses
        </Button>
        <Button
          variant="unstyled"
          type="button"
          onClick={() => setActiveTab("INCOME")}
          className={`grow text-center py-2 text-base font-medium border-b-2 ${
            activeTab === "INCOME"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Income
        </Button>
      </div>
      {/* Select Option Tab */}

      {/* Categories Grid */}
      <CategoryGrid
        categories={filteredCategories}
        isLoading={isCategoriesLoading}
        isEditingList={isEditingList}
        draggedIndex={draggedIndex}
        onNewCategoryClick={() => {
          setEditingCategory(null);
          setIsCUModalOpen(true);
        }}
        onCategoryClick={(category) => {
          startEdit(category);
          setIsCUModalOpen(true);
        }}
        onDeleteClick={handleDelete}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      <CUCategoryModal
        isOpen={isCUModalOpen}
        onClose={() => {
          setIsCUModalOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onSubmit={onSubmit}
        isPending={isCreating || isUpdating}
        register={register}
        handleSubmit={handleSubmit}
        setValue={setValue}
        errors={errors}
        customColor={customColor}
        setCustomColor={setCustomColor}
        transactionType={transactionType}
        selectedColor={selectedColor}
        selectedIconName={selectedIconName}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={categoryToDelete !== null}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
        icon={CircleX}
        title="Delete Category?"
        des={`Are you sure you want to delete category "${categoryToDelete?.name}"?`}
        confirmLabel="Delete"
      />

      <LoadingModal isOpen={isCreating || isUpdating || isDeleting} />
    </div>
  );
}
