import { ClipboardPenLine, ChevronRight } from "lucide-react";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";
import { useTransactionsQuery } from "@/features/transactions/hooks/transaction.hook";
import { TransactionListContainer } from "@/features/transactions/containers/TransactionListContainer";
import { TransactionResponse } from "@/shared/lib/types/transaction.type";
import { useMemo } from "react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils/core.util";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

export default function RecentJournalContainer() {
  const mounted = useMounted();
  const { t, locale } = useTranslation();

  const { data: transactionsData, isPending: isTransactionsPending } =
    useTransactionsQuery({
      limit: 5,
      sortType: "DATE_NEWEST",
    });

  const isLoading = !mounted || isTransactionsPending;

  const groupedTransactions = useMemo(() => {
    if (!transactionsData?.items) return [];

    const groupsMap = new Map<string, TransactionResponse[]>();

    transactionsData.items.forEach((tx: TransactionResponse) => {
      const date = new Date(tx.transactionDate);
      const dateStr = Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);

      if (!groupsMap.has(dateStr)) {
        groupsMap.set(dateStr, []);
      }
      groupsMap.get(dateStr)!.push(tx);
    });

    return Array.from(groupsMap.entries()).map(([dateStr, items]) => ({
      dateStr,
      items,
    }));
  }, [transactionsData, locale]);

  return (
    <section
      className={cn(
        groupedTransactions.length === 0 && !isLoading && "px-4 mb-2",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between mb-2",
          groupedTransactions.length > 0 && "px-4",
          isLoading && "px-4",
        )}
      >
        <span className="text-lg font-medium">{t("recentJournal")}</span>
        {groupedTransactions.length > 0 && (
          <Link
            href="/journal"
            className="flex items-center text-sm text-primary"
          >
            {t("seeAll")}
            <ChevronRight size={16} />
          </Link>
        )}
      </div>

      {groupedTransactions.length === 0 && !isLoading ? (
        <div className="bg-surface flex flex-col items-center gap-3 py-8 rounded-md border-2 border-border border-dashed">
          <div className="flex items-center">
            <span className="bg-surface-secondary p-4 rounded-full">
              <ClipboardPenLine className="text-secondary-text" size={24} />
            </span>
          </div>
          <span className="text-base font-normal text-secondary-text">
            {t("financialTimelineStartsHere")}
          </span>
          <span className="text-base font-normal text-secondary-text text-center max-w-68">
            {t("logFirstTransactionJournal")}
          </span>
        </div>
      ) : (
        <TransactionListContainer
          groupedTransactions={groupedTransactions}
          isLoadingTransactions={isLoading}
          page="journal"
        />
      )}
    </section>
  );
}
