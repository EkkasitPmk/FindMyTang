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

export function getTargetIndexFromTouch(e: React.TouchEvent): number | null {
  const touch = e.touches[0];
  if (!touch) return null;
  const el = document
    .elementFromPoint(touch.clientX, touch.clientY)
    ?.closest("[data-index]") as HTMLElement | null;
  if (!el) return null;
  const idx = Number.parseInt(el.dataset.index ?? "", 10);
  return Number.isNaN(idx) ? null : idx;
}
