import { Category } from "@/shared/lib/types/category.type";
import { CircleX, Grip, Plus, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getCategoryIcon } from "@/shared/lib/configs/category-icons.config";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

const SKELETON_CATEGORIES = Array.from({ length: 12 }, (_, i) => i);

interface CategoryGridProps {
  categories: Category[];
  isEditingList: boolean;
  isLoading?: boolean;
  isDeletedTab?: boolean;
  draggedIndex: number | null;
  onNewCategoryClick: () => void;
  onCategoryClick: (category: Category) => void;
  onDeleteClick: (category: Category) => void;
  onRestoreClick?: (category: Category) => void;
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
  isDeletedTab = false,
  draggedIndex,
  onNewCategoryClick,
  onCategoryClick,
  onDeleteClick,
  onRestoreClick,
  onDragStart,
  onDragOver,
  onDragEnd,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: Readonly<CategoryGridProps>) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2 overflow-auto max-h-[74dvh]">
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
    <div className="grid grid-cols-3 gap-2 overflow-auto max-h-[74dvh] p-1">
      {/* New Category (Hide on Deleted Tab) */}
      {!isDeletedTab && (
        <div>
          <Button
            variant="unstyled"
            type="button"
            onClick={onNewCategoryClick}
            className="w-full flex flex-col items-center justify-center gap-3 border border-border border-dashed p-4 rounded-lg cursor-pointer hover:bg-surface-variant/10 transition-colors"
          >
            <span className="bg-surface-secondary p-2 rounded-lg text-secondary-text">
              <Plus size={16} />
            </span>
            <span className="text-xs font-medium truncate">
              {t("newCategory")}
            </span>
          </Button>
        </div>
      )}

      {categories.length === 0 && isDeletedTab && (
        <div className="col-span-3 flex flex-col items-center justify-center h-[50vh] text-secondary-text text-xs">
          <p>{t("noCategoriesFound")}</p>
        </div>
      )}

      {categories.map((category, index) => {
        const IconComponent = getCategoryIcon(category.icon);
        const isDraggable =
          !isDeletedTab && isEditingList && !category.isSystem;

        let cardInteractionClass = "cursor-pointer hover:bg-surface-variant/10";
        if (isDraggable) {
          cardInteractionClass =
            "cursor-grab active:cursor-grabbing hover:border-primary/50";
        } else if (isDeletedTab) {
          cardInteractionClass =
            "cursor-default opacity-75 bg-surface-secondary/30";
        }

        return (
          <div
            key={category.id}
            className={`relative select-none ${
              draggedIndex === index ? "opacity-40" : ""
            }`}
          >
            <Button
              variant="unstyled"
              type="button"
              data-index={index}
              tabIndex={isEditingList ? -1 : 0}
              onClick={() => {
                if (isEditingList || isDeletedTab) return;
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
              className={`w-full flex flex-col items-center justify-center gap-2.5 border border-border p-3.5 rounded-lg transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                ${cardInteractionClass}
                ${draggedIndex === index ? "border-dashed border-primary" : ""}
              `}
            >
              <span
                className="p-2 rounded-lg relative"
                style={{
                  backgroundColor: category.color
                    ? `${category.color}15`
                    : "rgba(var(--accent), 0.1)",
                  color: category.color || "inherit",
                }}
              >
                <IconComponent size={16} />
              </span>
              <div className="flex flex-col items-center w-full min-w-0">
                <span className="text-xs font-medium truncate w-full text-center">
                  {category.name}
                </span>
                {isDeletedTab && (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded text-secondary-text/80 bg-surface-variant/20 mt-0.5">
                    {category.type === "EXPENSE" ? t("expenses") : t("income")}
                  </span>
                )}
              </div>
            </Button>

            <AnimatePresence>
              {isDeletedTab && isEditingList && onRestoreClick && (
                <motion.div
                  layout={false}
                  key={`restore-${category.id}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 450, damping: 28 }}
                  className="absolute top-1 left-1 z-10"
                >
                  <Button
                    variant="unstyled"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRestoreClick(category);
                    }}
                    className="rounded-full text-primary shadow-xs border border-border bg-surface p-1 hover:bg-primary/10 transition-colors"
                  >
                    <RotateCcw size={14} />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {!category.isSystem && isEditingList && (
                <motion.div
                  layout={false}
                  key={`delete-${category.id}`}
                  initial={{ scale: 0, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0, rotate: -45 }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 450, damping: 28 }}
                  className="absolute top-1 right-1 z-10"
                >
                  <Button
                    variant="unstyled"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteClick(category);
                    }}
                    className="rounded-full text-destructive shadow-xs border border-border hover:bg-destructive/10 transition-colors"
                  >
                    <CircleX size={18} className="fill-destructive/10" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {!isDeletedTab && !category.isSystem && isEditingList && (
                <motion.div
                  layout={false}
                  key={`grip-${category.id}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute bottom-0.5 right-1.5 cursor-grab"
                >
                  <Button
                    variant="unstyled"
                    className="text-secondary-text hover:text-primary-text"
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Grip size={14} />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
