import { DrilldownTransaction } from "../types/analytics.type";
import { formatCurrency } from "@/shared/lib/utils/currency.util";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Asset } from "@/features/assets/types/assets.type";
import { TransactionIcon } from "@/shared/components/customs/transactions/TransactionIcon";
import { TransactionResponse } from "@/features/transactions/types/transaction.type";

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
  if (transactions.length === 0) {
    return (
      <div className="text-center text-secondary-text py-10">
        No transactions this month
      </div>
    );
  }

  // Group by date
  const grouped = transactions.reduce(
    (acc, tx) => {
      const d = tx.date.split("T")[0];
      if (!acc[d]) acc[d] = [];
      acc[d].push(tx);
      return acc;
    },
    {} as Record<string, DrilldownTransaction[]>,
  );

  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([date, txs]) => (
        <div key={date}>
          <div className="text-sm font-medium text-secondary-text mb-2 ml-2">
            {format(new Date(date), "MMM d, yyyy", { locale: enUS })}
          </div>
          <div className="bg-surface rounded-xl border overflow-hidden divide-y divide-border">
            {txs.map((tx) => {
              const asset = assets?.find((a) => a.id === tx.asset.id);
              const assetColor = asset?.color || "var(--chart-2)";

              return (
                <div
                  key={tx.id}
                  className="px-4 py-3 flex items-center justify-between hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <TransactionIcon
                      transaction={
                        {
                          type: tx.type,
                          category: {
                            id: category.id,
                            name: category.name,
                            icon: category.icon,
                            color: category.color || "var(--primary-text)",
                          },
                        } as TransactionResponse
                      }
                    />
                    <div className="flex flex-col gap-1">
                      <p className="text-[14px] font-medium text-primary-text leading-none">
                        {tx.note || "No note"}
                      </p>
                      <span
                        className="inline-flex items-center w-fit px-1.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wide"
                        style={{
                          color: assetColor,
                          backgroundColor: assetColor.startsWith("#")
                            ? `${assetColor}1A`
                            : "var(--surface-secondary)",
                        }}
                      >
                        {tx.asset.name}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`font-semibold text-right ${
                      tx.type === "INCOME" ? "text-income" : "text-expense"
                    }`}
                  >
                    {tx.type === "INCOME" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
