import { Category } from "@/shared/lib/types/category.type";

export const reorderCategoriesList = (
  categories: Category[],
  activeTab: string,
  fromIndex: number,
  toIndex: number,
): Category[] => {
  const currentTabCategories = categories.filter((c) => c.type === activeTab);
  const updatedTabCategories = [...currentTabCategories];
  const [draggedItem] = updatedTabCategories.splice(fromIndex, 1);
  updatedTabCategories.splice(toIndex, 0, draggedItem);

  const otherTabCategories = categories.filter((c) => c.type !== activeTab);
  return [...updatedTabCategories, ...otherTabCategories];
};
