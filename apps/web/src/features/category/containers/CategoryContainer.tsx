"use client";
import { useState, useEffect } from "react";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";
import { toast } from "react-toastify";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCategorySchema,
  CreateCategoryFormValues,
} from "../schemas/category.form.schema";
import { PREMIUM_COLORS } from "../configs/category.config";
import { useCategories } from "@/shared/lib/hooks/useCategories.hook";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useRestoreCategoryMutation,
  useCategoryUIStore,
  useReorderCategoriesMutation,
} from "../hooks/category.hook";
import { ApiErrorResponse } from "@/shared/lib/types/api.type";
import { Category } from "@/shared/lib/types/category.type";
import { CircleX } from "lucide-react";
import ConfirmModal from "@/shared/components/customs/ConfirmModal";
import CUCategoryModal from "../components/CUCategoryModal";
import LoadingModal from "@/shared/components/customs/LoadingModal";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { useModalState } from "@/shared/lib/hooks/useModalState.hook";
import CategoryGrid from "../components/CategoryGrid";
import {
  getTargetIndexFromTouch,
  reorderCategoriesList,
} from "../helpers/category.helper";
import { handleFormError } from "@/shared/lib/helpers/form.helper";
import { AxiosError } from "axios";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContents,
  TabsContent,
} from "@/shared/components/animate-ui/components/animate/tabs";

type TabType = "EXPENSE" | "INCOME" | "DELETED";

export default function CategoryContainer() {
  const { t } = useTranslation();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("EXPENSE");
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [isHardDeleteChecked, setIsHardDeleteChecked] = useState(false);
  const [isCUModalOpen, setIsCUModalOpen] = useState(false);
  const { modalState, setModalState, resetModalState } = useModalState();

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

  const mounted = useMounted();

  const { data: categories, isPending } = useCategories(true);
  const isCategoriesLoading = !mounted || isPending;

  const [prevCategories, setPrevCategories] = useState(categories);
  const [localCategories, setLocalCategories] = useState<Category[]>(
    categories ?? [],
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (prevCategories !== categories) {
    setPrevCategories(categories);
    setLocalCategories(categories ?? []);
  }

  const { mutate: reorderCategories } = useReorderCategoriesMutation({
    onError: () => {
      toast.error(t("errUpdateCategoryOrder"));
    },
  });

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (
      draggedIndex === null ||
      draggedIndex === index ||
      activeTab === "DELETED"
    )
      return;

    setLocalCategories(
      reorderCategoriesList(localCategories, activeTab, draggedIndex, index),
    );
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    if (activeTab === "DELETED") return;
    setDraggedIndex(null);
    const currentTabCategories = localCategories.filter(
      (c) => c.type === activeTab && !c.deletedAt,
    );
    const ids = currentTabCategories.map((c) => c.id);
    reorderCategories(ids);
  };

  const handleTouchStart = (index: number) => {
    if (activeTab === "DELETED") return;
    setDraggedIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggedIndex === null || activeTab === "DELETED") return;
    const targetIndex = getTargetIndexFromTouch(e);
    if (targetIndex === null || draggedIndex === targetIndex) return;

    setLocalCategories(
      reorderCategoriesList(
        localCategories,
        activeTab,
        draggedIndex,
        targetIndex,
      ),
    );
    setDraggedIndex(targetIndex);
  };

  const handleTouchEnd = () => {
    if (draggedIndex === null || activeTab === "DELETED") return;
    handleDragEnd();
  };

  const { mutate: createCategory, isPending: isCreating } =
    useCreateCategoryMutation({
      onSuccess: (data) => {
        setModalState({
          isOpen: true,
          status: "success",
          message: t("categoryCreatedSuccess").replace("{name}", data.name),
        });
        setIsCUModalOpen(false);
      },
    });

  const { mutate: updateCategory, isPending: isUpdating } =
    useUpdateCategoryMutation({
      onSuccess: (data) => {
        setModalState({
          isOpen: true,
          status: "success",
          message: t("categoryUpdatedSuccess").replace("{name}", data.name),
        });
        setEditingCategory(null);
        setIsCUModalOpen(false);
      },
    });

  const { mutate: restoreCategory, isPending: isRestoring } =
    useRestoreCategoryMutation({
      onSuccess: (data) => {
        setModalState({
          isOpen: true,
          status: "success",
          message: t("categoryRestoredSuccess").replace("{name}", data.name),
        });
        if (editingCategory?.id === data.id) {
          setIsCUModalOpen(false);
          setEditingCategory(null);
        }
      },
      onError: (err) => {
        const message = err.response?.data?.message;
        const errorMsg = Array.isArray(message)
          ? message[0]
          : message || t("errRestoreCategory");
        setModalState({
          isOpen: true,
          status: "error",
          message: errorMsg,
        });
      },
    });

  const { mutate: deleteCategory, isPending: isDeleting } =
    useDeleteCategoryMutation({
      onSuccess: (data) => {
        setModalState({
          isOpen: true,
          status: "success",
          message: t("categoryDeletedSuccess").replace("{name}", data.name),
        });
        if (editingCategory?.id === data.id) {
          cancelEdit();
        }
      },
      onError: (err) => {
        const message = err.response?.data?.message;
        const errorMsg = Array.isArray(message)
          ? message[0]
          : message || t("errDeleteCategory");
        setModalState({
          isOpen: true,
          status: "error",
          message: errorMsg,
        });
      },
    });

  const openCreateModal = () => {
    setEditingCategory(null);
    setCustomColor("#e11d48");
    setIsCUModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);

    const color =
      category.color && !PREMIUM_COLORS.includes(category.color)
        ? category.color
        : "#e11d48";

    setCustomColor(color);
    setIsCUModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    // ponytail: Sets category state to open custom ConfirmModal.
    setIsHardDeleteChecked(false);
    setCategoryToDelete(category);
  };

  const handleConfirmDelete = (isHardFromModal?: boolean) => {
    if (categoryToDelete) {
      const isAlreadyDeleted =
        Boolean(categoryToDelete.deletedAt) || activeTab === "DELETED";
      const isHardDelete =
        isAlreadyDeleted || Boolean(isHardFromModal || isHardDeleteChecked);

      deleteCategory({
        id: categoryToDelete.id,
        isHardDelete,
      });
      setCategoryToDelete(null);
      setIsHardDeleteChecked(false);
    }
  };

  const onSubmit = (values: CreateCategoryFormValues) => {
    if (editingCategory?.deletedAt) return;

    const mutationOptions = {
      onError: (err: AxiosError<ApiErrorResponse>) => {
        handleFormError(err, setError, t("errSaveCategory"), {
          name: "name",
          type: "type",
          color: "color",
          icon: "icon",
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

  const cancelEdit = () => {
    setEditingCategory(null);
    setIsCUModalOpen(false);
  };

  const isDeletingSoftDeletedCategory =
    Boolean(categoryToDelete?.deletedAt) || activeTab === "DELETED";

  return (
    <div className="space-y-2 px-4 py-2">
      <div className="mb-2">
        <h2 className="text-xl font-bold">{t("categoryManagement")}</h2>
        <p className="text-sm">{t("categoryManagementDesc")}</p>
      </div>

      {/* Select Option Tab & Animated Category Grid Contents */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as TabType)}
        className="w-full gap-1"
      >
        <div className="relative z-10 w-full">
          <TabsList className="w-full grid grid-cols-3 h-fit">
            <TabsTrigger value="EXPENSE" className="text-sm truncate">
              {t("expenses")}
            </TabsTrigger>
            <TabsTrigger value="INCOME" className="text-sm truncate">
              {t("income")}
            </TabsTrigger>
            <TabsTrigger value="DELETED" className="text-sm truncate">
              {t("deletedCategories")}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContents className="w-full">
          <TabsContent value="EXPENSE" className="w-full">
            <CategoryGrid
              categories={localCategories.filter(
                (cat) => cat.type === "EXPENSE" && !cat.deletedAt,
              )}
              isLoading={isCategoriesLoading}
              isEditingList={isEditingList}
              draggedIndex={activeTab === "EXPENSE" ? draggedIndex : null}
              onNewCategoryClick={openCreateModal}
              onCategoryClick={openEditModal}
              onDeleteClick={handleDelete}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </TabsContent>
          <TabsContent value="INCOME" className="w-full">
            <CategoryGrid
              categories={localCategories.filter(
                (cat) => cat.type === "INCOME" && !cat.deletedAt,
              )}
              isLoading={isCategoriesLoading}
              isEditingList={isEditingList}
              draggedIndex={activeTab === "INCOME" ? draggedIndex : null}
              onNewCategoryClick={openCreateModal}
              onCategoryClick={openEditModal}
              onDeleteClick={handleDelete}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </TabsContent>
          <TabsContent value="DELETED" className="w-full">
            <CategoryGrid
              categories={localCategories.filter((cat) =>
                Boolean(cat.deletedAt),
              )}
              isLoading={isCategoriesLoading}
              isEditingList={isEditingList}
              isDeletedTab={true}
              draggedIndex={null}
              onNewCategoryClick={openCreateModal}
              onCategoryClick={openEditModal}
              onDeleteClick={handleDelete}
              onRestoreClick={(cat) => restoreCategory(cat.id)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </TabsContent>
        </TabsContents>
      </Tabs>

      <CUCategoryModal
        isOpen={isCUModalOpen}
        onClose={cancelEdit}
        category={editingCategory}
        isDeletedCategory={Boolean(editingCategory?.deletedAt)}
        onRestore={() => {
          if (editingCategory) restoreCategory(editingCategory.id);
        }}
        onDeletePermanent={() => {
          if (editingCategory) handleDelete(editingCategory);
        }}
        onSubmit={onSubmit}
        isPending={isCreating || isUpdating || isRestoring}
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
        onClose={() => {
          setCategoryToDelete(null);
          setIsHardDeleteChecked(false);
        }}
        onConfirm={handleConfirmDelete}
        icon={CircleX}
        title={
          isDeletingSoftDeletedCategory
            ? t("deleteCategoryPermanentTitle")
            : t("deleteCategoryTitle")
        }
        des={
          isDeletingSoftDeletedCategory
            ? t("deleteCategoryPermanentDesc").replace(
                "{name}",
                categoryToDelete?.name || "",
              )
            : t("deleteCategoryDesc").replace(
                "{name}",
                categoryToDelete?.name || "",
              )
        }
        confirmLabel={t("delete")}
        withHardDeleteOption={!isDeletingSoftDeletedCategory}
        hardDeleteCheckboxLabel={t("hardDeleteCheckboxLabel")}
        isHardDelete={isHardDeleteChecked}
        onHardDeleteChange={setIsHardDeleteChecked}
      />

      <LoadingModal
        isOpen={
          modalState.isOpen ||
          isCreating ||
          isUpdating ||
          isDeleting ||
          isRestoring
        }
        status={modalState.isOpen ? modalState.status : "loading"}
        message={modalState.isOpen ? modalState.message : undefined}
        onClose={resetModalState}
      />
    </div>
  );
}
