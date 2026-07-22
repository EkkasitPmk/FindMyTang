import { cn } from "@/shared/lib/utils/core.util";
import { Plus } from "lucide-react";
import { getCategoryIcon } from "@/shared/lib/configs/category-icons.config";
import { Category } from "@/shared/lib/types/category.type";
import { Button } from "@/shared/components/customs/Button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

const SKELETON_CATEGORIES = Array.from({ length: 12 }, (_, i) => i);

interface TransactionCategoryListProps {
  categories: Category[];
  activeCategoryId: string | null;
  onSelectCategory: (id: string) => void;
  onEditClick: () => void;
  isLoadingCategoryList: boolean;
}

export default function TransactionCategoryList({
  categories,
  activeCategoryId,
  onSelectCategory,
  onEditClick,
  isLoadingCategoryList,
}: Readonly<TransactionCategoryListProps>) {
  const { t } = useTranslation();

  return (
    <section className="space-y-1">
      <p className="uppercase text-sm text-secondary-text font-medium">
        {t("categoryUppercase")}
      </p>
      {isLoadingCategoryList ? (
        <div className="grid grid-cols-4 gap-y-2 overflow-auto max-h-[24vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
          {SKELETON_CATEGORIES.map((id) => (
            <div key={id} className="flex flex-col items-center gap-1">
              <Skeleton className="h-10.5 w-10.5 rounded-xl" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-y-2 overflow-auto max-h-[24vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.icon);
            const isSelected = activeCategoryId === category.id;

            const backgroundColor =
              isSelected && category.color
                ? `${category.color}33`
                : "var(--color-surface-secondary)";

            const borderColor = isSelected
              ? category.color || "var(--color-primary)"
              : "transparent";

            return (
              <Button
                variant="unstyled"
                key={category.id}
                type="button"
                onClick={() => onSelectCategory(category.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-all",
                  !isSelected && "hover:bg-surface-variant/10",
                )}
              >
                <span
                  className="p-3 rounded-xl transition-all border"
                  style={{
                    color: category.color || "inherit",
                    backgroundColor,
                    borderColor,
                  }}
                >
                  <Icon size={18} />
                </span>
                <span
                  className={cn(
                    "uppercase text-xs truncate font-medium w-full text-center transition-colors",
                    isSelected ? "text-primary-text" : "text-secondary-text",
                  )}
                >
                  {category.name}
                </span>
              </Button>
            );
          })}
          {/* ปุ่มแก้ไข category กดแล้วเรียก Callback ไปที่ Container */}
          <Button
            variant="unstyled"
            type="button"
            onClick={onEditClick}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer"
          >
            <span className="p-3 rounded-xl bg-primary-light text-primary">
              <Plus size={18} />
            </span>
            <span className="uppercase text-primary text-xs font-medium truncate">
              {t("edit")}
            </span>
          </Button>
        </div>
      )}
    </section>
  );
}
