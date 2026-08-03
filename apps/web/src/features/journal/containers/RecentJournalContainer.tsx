import { ClipboardPenLine, ChevronRight } from "lucide-react";
import { useTransactionsQuery } from "@/features/transactions/hooks/transaction.hook";
import { TransactionListContainer } from "@/features/transactions/containers/TransactionListContainer";
import { TransactionResponse } from "@/shared/lib/types/transaction.type";
import { useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { cn } from "@/shared/lib/utils/core.util";

export default function RecentJournalContainer() {
  const { t, locale } = useTranslation();
  const { data: transactionsData, isPending: isTransactionsPending } =
    useTransactionsQuery({
      limit: 5,
      sortType: "DATE_NEWEST",
    });

  const isLoading = isTransactionsPending;

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

  const isEmpty = groupedTransactions.length === 0 && !isLoading;

  return (
    <section className={cn(isEmpty && "pb-18")}>
      <div className="flex items-center justify-between mb-2 px-4">
        <span className="text-lg font-medium">{t("recentJournal")}</span>
        {!isEmpty && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/journal"
              className="flex items-center text-sm text-primary"
            >
              {t("seeAll")}
              <ChevronRight size={16} />
            </Link>
          </motion.div>
        )}
      </div>

      {isEmpty ? (
        <div className="bg-surface mx-4 flex flex-col items-center gap-3 py-8 rounded-md border-2 border-border border-dashed">
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
