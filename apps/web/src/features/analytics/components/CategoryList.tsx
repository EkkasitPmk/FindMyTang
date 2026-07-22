import { CategoryBreakdownItem } from "../schemas/analytics.response.schema";
import { formatCurrency } from "@/shared/lib/utils/currency.util";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { TransactionIcon } from "@/shared/components/customs/TransactionIcon";
import { TransactionResponse } from "@/shared/lib/types/transaction.type";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

interface CategoryListProps {
  data: CategoryBreakdownItem[];
  month: number;
  year: number;
}

export const CategoryList = ({ data, month, year }: CategoryListProps) => {
  const { t } = useTranslation();

  if (data.length === 0) return null;

  return (
    <div className="space-y-1 px-4 pb-4">
      <p className="text-primary-text text-base">{t("categoryList")}</p>
      {data.map((item, index) => {
        const color = item.categoryColor || `var(--chart-${(index % 5) + 1})`;

        return (
          <Link
            key={item.categoryId}
            href={`/analytics/category/${item.categoryId}?month=${month}&year=${year}`}
            className="flex items-center justify-between px-3 py-2 bg-surface rounded-xl border active-press transition-transform"
          >
            <div className="flex items-center gap-3">
              <TransactionIcon
                transaction={
                  {
                    type: "EXPENSE",
                    category: {
                      id: item.categoryId,
                      name: item.categoryName,
                      icon: item.categoryIcon,
                      color: color,
                    },
                  } as TransactionResponse
                }
              />
              <div>
                <p className="text-[15px] font-medium text-primary-text">
                  {item.categoryName}
                </p>
                <p className="text-[12px] text-secondary-text">
                  {item.percentage.toFixed(1)}% • {item.transactionCount}{" "}
                  {t("items")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[15px] text-primary-text">
                {formatCurrency(item.totalAmount)}
              </span>
              <ChevronRight className="w-4 h-4 text-disabled-text" />
            </div>
          </Link>
        );
      })}
    </div>
  );
};
