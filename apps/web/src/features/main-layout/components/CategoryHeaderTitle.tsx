import { TransactionIcon } from "@/shared/components/customs/TransactionIcon";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  TransactionResponse,
  TransactionType,
} from "@/shared/lib/types/transaction.type";
import { CategoryHeaderTitleProps } from "../types/main-layout.type";

export default function CategoryHeaderTitle({
  category,
}: Readonly<CategoryHeaderTitleProps>) {
  if (category) {
    return (
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1.5">
          <TransactionIcon
            transaction={
              {
                type: (category.type as TransactionType) || "EXPENSE",
                category: {
                  id: category.id,
                  name: category.name,
                  icon: category.icon,
                  color: category.color || "var(--primary-text)",
                },
              } as TransactionResponse
            }
          />
          <span className="text-base font-bold text-primary-text leading-none">
            {category.name}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1.5 mt-0.5">
        <Skeleton className="w-8.5 h-8.5 rounded-lg shrink-0" />
        <Skeleton className="w-16 h-4 rounded" />
      </div>
    </div>
  );
}
