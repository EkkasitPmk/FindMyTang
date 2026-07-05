import { cn } from "@/shared/lib/utils/core.util";
import { getCategoryIcon } from "@/shared/lib/configs/category-icons.config";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Category } from "@/features/category/types/category.type";
import { Button } from "@/shared/components/customs/Button";
import { Skeleton } from "@/shared/components/ui/skeleton";

const SKELETON_CATEGORIES = Array.from({ length: 12 }, (_, i) => i);

interface TransactionCategoryListProps {
  categories: Category[];
  activeCategoryId: string | null;
  onSelectCategory: (id: string) => void;
  isLoadingCategoryList: boolean;
}

export default function TransactionCategoryList({
  categories,
  activeCategoryId,
  onSelectCategory,
  isLoadingCategoryList,
}: Readonly<TransactionCategoryListProps>) {
  return (
    <section className="space-y-1">
      <p className="uppercase text-sm text-secondary-text font-medium">
        CATEGORY
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
            const Icon = getCategoryIcon(category.icon, category.type);
            const isSelected = activeCategoryId === category.id;

            return (
              <Button
                variant="unstyled"
                key={category.id}
                type="button"
                onClick={() => onSelectCategory(category.id)}
                className="flex flex-col items-center justify-center gap-1"
              >
                <span
                  className={cn(
                    "p-3 rounded-xl transition-all",
                    isSelected
                      ? "text-primary-text"
                      : "bg-surface-secondary text-secondary-text",
                  )}
                  style={{
                    color: isSelected ? category.color : undefined,
                    backgroundColor: isSelected
                      ? `${category.color}33`
                      : undefined,
                  }}
                >
                  <Icon size={18} />
                </span>
                <span
                  className={cn(
                    "uppercase text-xs truncate font-medium w-full text-center ",
                    isSelected ? "text-primary-text" : "text-secondary-text",
                  )}
                >
                  {category.name}
                </span>
              </Button>
            );
          })}
          {/* ปุ่มแก้ไข category กดแล้วไปยัง /categories */}
          <Link
            href="/categories"
            className="flex flex-col items-center justify-center gap-1"
          >
            <span className="p-3 rounded-xl bg-primary-light text-primary">
              <Plus size={18} />
            </span>
            <span className="uppercase text-primary text-xs font-medium truncate">
              Edit
            </span>
          </Link>
        </div>
      )}
    </section>
  );
}
