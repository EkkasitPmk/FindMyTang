import { GroupedTransaction } from "@/shared/lib/types/transaction.type";
import { TranslationKey } from "@/shared/lib/configs/translations.config";
import { getDiffDays } from "@/shared/lib/helpers/date.helper";
import {
  calculateNetTotal,
  getTopRowText,
  getNetTotalConfig,
} from "@/shared/lib/helpers/transaction-list.helper";
import { cn } from "@/shared/lib/utils/core.util";

export interface TransactionGroupHeaderProps {
  group: GroupedTransaction;
  t: (key: TranslationKey) => string;
  locale: string;
  className?: string;
}

export function TransactionGroupHeader({
  group,
  t,
  locale,
  className,
}: Readonly<TransactionGroupHeaderProps>) {
  const netTotal = calculateNetTotal(group.items);
  const isTransferOnly = group.items.every(
    (transaction) => transaction.type === "TRANSFER",
  );
  const txDate = new Date(group.items[0].transactionDate);
  const diffDays = getDiffDays(txDate);
  const topRow = getTopRowText(diffDays, (key) => t(key as TranslationKey));

  const bottomRow = txDate.toLocaleDateString(locale, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year:
      txDate.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });

  const { colorClass: netTotalColorClass, prefix: netTotalPrefix } =
    getNetTotalConfig(netTotal);

  return (
    <div className={cn("flex justify-between items-center", className)}>
      <div className="flex flex-col">
        <span className="text-base font-medium text-primary-text flex items-center gap-1">
          {topRow}{" "}
          <span className="text-secondary-text text-xs">
            • {group.items.length}{" "}
            {group.items.length === 1 ? t("item") : t("items")}
          </span>
        </span>
        <span className="text-sm font-normal text-secondary-text capitalize">
          {bottomRow}
        </span>
      </div>
      <span
        className={cn(
          "text-base",
          isTransferOnly ? "text-secondary-text" : netTotalColorClass,
        )}
      >
        {isTransferOnly
          ? "—"
          : `${netTotalPrefix}฿${Math.abs(netTotal).toLocaleString(locale, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
      </span>
    </div>
  );
}
