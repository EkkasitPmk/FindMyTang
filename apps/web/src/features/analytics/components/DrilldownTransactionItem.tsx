import { DrilldownTransaction } from "../schemas/analytics.response.schema";
import { Asset } from "@/shared/lib/types/asset.type";
import { formatCurrency } from "@/shared/lib/utils/currency.util";
import { TransactionIcon } from "@/shared/components/customs/TransactionIcon";
import { TransactionResponse } from "@/shared/lib/types/transaction.type";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import {
  getAssetBadgeStyle,
  getTxAmountDisplay,
  getTxTime,
} from "../helpers/drilldown.helper";

interface DrilldownTransactionItemProps {
  tx: DrilldownTransaction;
  category: {
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
  };
  assets?: Asset[];
}

export const DrilldownTransactionItem = ({
  tx,
  category,
  assets,
}: DrilldownTransactionItemProps) => {
  const { t } = useTranslation();
  const asset = assets?.find((a) => a.id === tx.asset.id);
  const toAsset = tx.toAsset
    ? assets?.find((a) => a.id === tx.toAsset?.id)
    : undefined;

  const timeStr = getTxTime(tx.date);
  const numericAmount = Number(tx.amount);
  const { signPrefix, colorClass } = getTxAmountDisplay(tx.type, numericAmount);

  return (
    <div className="px-4 py-3 flex items-center justify-between hover:bg-surface-hover transition-colors">
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
          <p className="text-[0.875rem] font-medium text-primary-text leading-none">
            {tx.note || t("noNote")}
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            {tx.type === "TRANSFER" && tx.toAsset ? (
              <div className="flex items-center gap-1">
                <span
                  className="inline-flex items-center w-fit px-1.5 py-0.5 rounded-md text-[0.625rem] font-semibold tracking-wide"
                  style={getAssetBadgeStyle(asset?.color)}
                >
                  {tx.asset.name}
                </span>
                <span className="text-[0.625rem] text-secondary-text font-medium">
                  →
                </span>
                <span
                  className="inline-flex items-center w-fit px-1.5 py-0.5 rounded-md text-[0.625rem] font-semibold tracking-wide"
                  style={getAssetBadgeStyle(toAsset?.color)}
                >
                  {tx.toAsset.name}
                </span>
              </div>
            ) : (
              <span
                className="inline-flex items-center w-fit px-1.5 py-0.5 rounded-md text-[0.625rem] font-semibold tracking-wide"
                style={getAssetBadgeStyle(asset?.color)}
              >
                {tx.asset.name}
              </span>
            )}
            {timeStr && (
              <span className="text-[0.6875rem] text-secondary-text font-normal">
                {timeStr}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className={`font-semibold text-right ${colorClass}`}>
        {signPrefix}
        {formatCurrency(Math.abs(numericAmount))}
      </div>
    </div>
  );
};
