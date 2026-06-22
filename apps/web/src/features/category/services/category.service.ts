import http from "@/shared/lib/api/http";
import { Category, CreateCategoryRequest } from "../types/category.type";

export const createCategoryApi = async (
  data: CreateCategoryRequest,
): Promise<Category> => {
  // ponytail: Category creation api call.
  const response = await http.post<Category>("/categories", data);
  return response.data;
};

export const getCategoriesApi = async (): Promise<Category[]> => {
  // ponytail: Fetch all categories api call.
  const response = await http.get<Category[]>("/categories");
  return response.data;
};

export const updateCategory = async (
  id: string,
  data: Partial<CreateCategoryRequest>,
): Promise<Category> => {
  // ponytail: Category update api call.
  const response = await http.patch<Category>(`/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: string): Promise<Category> => {
  // ponytail: Category deletion api call.
  const response = await http.delete<Category>(`/categories/${id}`);
  return response.data;
};

export const reorderCategoriesApi = async (
  ids: string[],
): Promise<{ success: boolean }> => {
  // ponytail: Category reorder api call.
  const response = await http.patch<{ success: boolean }>(
    "/categories/reorder",
    { ids },
  );
  return response.data;
};
