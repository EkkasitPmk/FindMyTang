import http from "@/shared/lib/api/http";
import { Category, CreateCategoryRequest } from "../types/category.type";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import {
  db,
  CategoryType as DexieCategoryType,
} from "@/shared/lib/storages/dexie.storage";
import { v4 as uuidv4 } from "uuid";

export const createCategoryApi = async (
  data: CreateCategoryRequest,
): Promise<Category> => {
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
    return newCategory as unknown as Category;
  }
  const response = await http.post<Category>("/categories", data);
  return response.data;
};

export const getCategoriesApi = async (): Promise<Category[]> => {
  if (useGuestStore.getState().isGuest) {
    const categories = await db.categories
      .filter((c) => !c.deletedAt)
      .sortBy("displayOrder");
    return categories as unknown as Category[];
  }
  const response = await http.get<Category[]>("/categories");
  return response.data;
};

export const updateCategory = async (
  id: string,
  data: Partial<CreateCategoryRequest>,
): Promise<Category> => {
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
    return updated as unknown as Category;
  }
  const response = await http.patch<Category>(`/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: string): Promise<Category> => {
  if (useGuestStore.getState().isGuest) {
    const existing = await db.categories.get(id);
    if (!existing) throw new Error("Category not found");
    existing.deletedAt = new Date().toISOString();
    existing.updatedAt = new Date().toISOString();
    existing.syncStatus = "pending";
    await db.categories.put(existing);
    return existing as unknown as Category;
  }
  const response = await http.delete<Category>(`/categories/${id}`);
  return response.data;
};

export const reorderCategoriesApi = async (
  ids: string[],
): Promise<{ success: boolean }> => {
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
    return { success: true };
  }
  const response = await http.patch<{ success: boolean }>(
    "/categories/reorder",
    { ids },
  );
  return response.data;
};
