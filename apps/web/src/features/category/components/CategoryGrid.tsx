import { Category } from "../types/category.type";
import { CircleX, Grip, Plus } from "lucide-react";
import { getCategoryIcon } from "@/shared/lib/configs/category-icons.config";
import { Button } from "@/shared/components/customs/Button";
import { Skeleton } from "@/shared/components/ui/skeleton";

const SKELETON_CATEGORIES = Array.from({ length: 12 }, (_, i) => i);

interface CategoryGridProps {
  categories: Category[];
  isEditingList: boolean;
  isLoading?: boolean;
  draggedIndex: number | null;
  onNewCategoryClick: () => void;
  onCategoryClick: (category: Category) => void;
  onDeleteClick: (category: Category) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onTouchStart: (index: number) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

export default function CategoryGrid({
  categories,
  isEditingList,
  isLoading,
  draggedIndex,
  onNewCategoryClick,
  onCategoryClick,
  onDeleteClick,
  onDragStart,
  onDragOver,
  onDragEnd,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: Readonly<CategoryGridProps>) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2 overflow-auto max-h-[70vh]">
        {SKELETON_CATEGORIES.map((id) => (
          <div
            key={`skeleton-${id}`}
            className="w-full flex flex-col items-center justify-center gap-3 border border-border p-4 rounded-lg"
          >
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 overflow-auto max-h-[70vh]">
      {/* New Category */}
      <Button
        variant="unstyled"
        type="button"
        onClick={onNewCategoryClick}
        className="flex flex-col items-center justify-center gap-3 border border-border border-dashed p-4 rounded-lg cursor-pointer hover:bg-surface-variant/10 transition-colors"
      >
        <span className="bg-surface-secondary p-2 rounded-lg text-secondary-text">
          <Plus size={16} />
        </span>
        <span className="text-xs font-medium truncate">New Category</span>
      </Button>
      {/* New Category */}

      {categories.map((category, index) => {
        const IconComponent = getCategoryIcon(category.icon);
        const isDraggable = isEditingList && !category.isSystem;

        return (
          <div
            key={category.id}
            className={`relative select-none transition-all
              ${draggedIndex === index ? "opacity-40" : ""}
            `}
          >
            <Button
              variant="unstyled"
              type="button"
              data-index={index}
              tabIndex={isEditingList ? -1 : 0}
              onClick={() => {
                if (isEditingList) return;
                onCategoryClick(category);
              }}
              draggable={isDraggable}
              onDragStart={(e) => onDragStart(e, index)}
              onDragOver={(e) => onDragOver(e, index)}
              onDragEnd={onDragEnd}
              onTouchStart={() => {
                if (isDraggable) onTouchStart(index);
              }}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              style={{
                touchAction: isDraggable ? "none" : "auto",
              }}
              className={`w-full flex flex-col items-center justify-center gap-3 border border-border p-4 rounded-lg transition-all
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                ${
                  isDraggable
                    ? "cursor-grab active:cursor-grabbing hover:border-primary/50"
                    : "cursor-pointer hover:bg-surface-variant/10"
                }
                ${draggedIndex === index ? "border-dashed border-primary" : ""}
              `}
            >
              <span
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: category.color
                    ? `${category.color}15`
                    : "rgba(var(--accent), 0.1)",
                  color: category.color || "inherit",
                }}
              >
                <IconComponent size={16} />
              </span>
              <span className="text-xs font-medium truncate w-full text-center">
                {category.name}
              </span>
            </Button>

            {!category.isSystem && isEditingList && (
              <Button
                variant="unstyled"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick(category);
                }}
                className="absolute top-1 right-1 text-destructive transition-colors"
              >
                <CircleX size={16} />
              </Button>
            )}

            {!category.isSystem && isEditingList && (
              <Button
                variant="unstyled"
                className="absolute bottom-1 right-1 cursor-grab"
                type="button"
                onClick={(e) => e.stopPropagation()}
              >
                <Grip size={14} />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
