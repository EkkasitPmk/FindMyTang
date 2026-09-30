import { DrilldownTransaction } from "../schemas/analytics.response.schema";
import { format } from "date-fns";
import { th, enUS } from "date-fns/locale";
import { Asset } from "@/shared/lib/types/asset.type";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { groupTransactionsByDate } from "../helpers/drilldown.helper";
import { DrilldownTransactionItem } from "./DrilldownTransactionItem";

interface DrilldownTransactionListProps {
  transactions: DrilldownTransaction[];
  category: {
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
  };
  assets?: Asset[];
}

export const DrilldownTransactionList = ({
  transactions,
  category,
  assets,
}: DrilldownTransactionListProps) => {
  const { t, currentLanguage } = useTranslation();
  const dateLocale = currentLanguage === "th" ? th : enUS;

  if (transactions.length === 0) {
    return (
      <div className="text-center text-secondary-text py-10">
        {t("noTransactionsThisMonth")}
      </div>
    );
  }

  const grouped = groupTransactionsByDate(transactions);

  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([dateKey, group]) => (
        <div key={dateKey}>
          <div className="text-sm font-medium text-secondary-text mb-2 ml-2">
            {format(group.dateObj, "MMM d, yyyy", { locale: dateLocale })}
          </div>
          <div className="bg-surface rounded-xl border border-border overflow-hidden divide-y divide-border">
            {group.txs.map((tx) => (
              <DrilldownTransactionItem
                key={tx.id}
                tx={tx}
                category={category}
                assets={assets}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
