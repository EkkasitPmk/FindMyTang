import http from "@/shared/lib/api/http";
import { CreateCategoryRequest } from "@/shared/lib/types/category.type";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import {
  db,
  CategoryType as DexieCategoryType,
} from "@/shared/lib/storages/dexie.storage";
import { v4 as uuidv4 } from "uuid";
import {
  categoryResponseSchema,
  categoryListResponseSchema,
  reorderCategoryResponseSchema,
  CategoryResponse,
  ReorderCategoryResponse,
} from "../schemas/category.response.schema";

export const createCategoryApi = async (
  data: CreateCategoryRequest,
): Promise<CategoryResponse> => {
  if (useGuestStore.getState().isGuest) {
    const newCategory = {
      id: uuidv4(),
      ...data,
      type: data.type as unknown as DexieCategoryType,
      isSystem: false,
      displayOrder: (await db.categories.count()) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      syncStatus: "pending" as const,
    };
    await db.categories.add(newCategory);
    return categoryResponseSchema.parse(newCategory);
  }
  const response = await http.post("/categories", data);
  return categoryResponseSchema.parse(response.data);
};

export const getCategoriesApi = async (): Promise<CategoryResponse[]> => {
  if (useGuestStore.getState().isGuest) {
    const categories = await db.categories
      .filter((c) => !c.deletedAt)
      .sortBy("displayOrder");
    return categoryListResponseSchema.parse(categories);
  }
  const response = await http.get("/categories");
  return categoryListResponseSchema.parse(response.data);
};

export const updateCategory = async (
  id: string,
  data: Partial<CreateCategoryRequest>,
): Promise<CategoryResponse> => {
  if (useGuestStore.getState().isGuest) {
    const existing = await db.categories.get(id);
    if (!existing) throw new Error("Category not found");
    const updated = {
      ...existing,
      ...data,
      type: data.type
        ? (data.type as unknown as DexieCategoryType)
        : existing.type,
      updatedAt: new Date().toISOString(),
      syncStatus: "pending" as const,
    };
    await db.categories.put(updated);
    return categoryResponseSchema.parse(updated);
  }
  const response = await http.patch(`/categories/${id}`, data);
  return categoryResponseSchema.parse(response.data);
};

export const deleteCategory = async (id: string): Promise<CategoryResponse> => {
  if (useGuestStore.getState().isGuest) {
    const existing = await db.categories.get(id);
    if (!existing) throw new Error("Category not found");
    existing.deletedAt = new Date().toISOString();
    existing.updatedAt = new Date().toISOString();
    existing.syncStatus = "pending";
    await db.categories.put(existing);
    return categoryResponseSchema.parse(existing);
  }
  const response = await http.delete(`/categories/${id}`);
  return categoryResponseSchema.parse(response.data);
};

export const reorderCategoriesApi = async (
  ids: string[],
): Promise<ReorderCategoryResponse> => {
  if (useGuestStore.getState().isGuest) {
    await db.transaction("rw", db.categories, async () => {
      for (let i = 0; i < ids.length; i++) {
        const cat = await db.categories.get(ids[i]);
        if (cat) {
          cat.displayOrder = i + 1;
          cat.updatedAt = new Date().toISOString();
          cat.syncStatus = "pending";
          await db.categories.put(cat);
        }
      }
    });
    return reorderCategoryResponseSchema.parse({ success: true });
  }
  const response = await http.patch("/categories/reorder", { ids });
  return reorderCategoryResponseSchema.parse(response.data);
};
