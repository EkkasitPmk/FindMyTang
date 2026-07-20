import { GroupedTransaction } from "@/features/transactions/types/transaction.type";
import { TranslationKey } from "@/shared/lib/configs/translations.config";
import { TransactionGroupHeader } from "./TransactionGroupHeader";
import { VirtuosoContext } from "./TransactionList";

export interface TransactionVirtuosoGroupProps {
  index: number;
  groupedTransactions: GroupedTransaction[];
  t: (key: TranslationKey) => string;
  locale: string;
}

export function TransactionVirtuosoGroup({
  index,
  groupedTransactions,
  t,
  locale,
}: Readonly<TransactionVirtuosoGroupProps>) {
  const group = groupedTransactions[index];

  if (!group) return null;

  return (
    <TransactionGroupHeader
      group={group}
      t={t}
      locale={locale}
      className="bg-surface py-1.5 px-4 pb-2"
    />
  );
}

export const renderGroupContent = (index: number, context: VirtuosoContext) => {
  return (
    <TransactionVirtuosoGroup
      index={index}
      groupedTransactions={context.groupedTransactions}
      t={context.t}
      locale={context.locale}
    />
  );
};
