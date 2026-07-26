import {
  GroupedTransaction,
  TransactionResponse,
} from "@/shared/lib/types/transaction.type";
import { TransactionItem } from "./TransactionItem";
import { VirtuosoContext } from "./TransactionList";
import { cn } from "@/shared/lib/utils/core.util";

export interface TransactionVirtuosoItemProps {
  index: number;
  groupIndex: number;
  groupedTransactions: GroupedTransaction[];
  flatItems: TransactionResponse[];
  assetId?: string;
  expandedTransactionId: string | null;
  setExpandedTransactionId: (id: string | null) => void;
  onTransactionItemClick: (transaction: TransactionResponse) => void;
  onRestoreClick?: (transaction: TransactionResponse) => void;
  onDeleteClick?: (transaction: TransactionResponse) => void;
  onAttachmentClick?: (url: string) => void;
}

export function TransactionVirtuosoItem({
  index,
  groupIndex,
  groupedTransactions,
  flatItems,
  assetId,
  expandedTransactionId,
  setExpandedTransactionId,
  onTransactionItemClick,
  onRestoreClick,
  onDeleteClick,
  onAttachmentClick,
}: Readonly<TransactionVirtuosoItemProps>) {
  const group = groupedTransactions[groupIndex];
  const transaction = flatItems[index];

  if (!group || !transaction) return null;

  const isLastItem = group.items.at(-1) === transaction;

  return (
    <div className={cn(isLastItem && "pb-4")}>
      <TransactionItem
        key={transaction.id}
        transaction={transaction}
        isLastItem={isLastItem}
        currentAssetId={assetId}
        expandedTransactionId={expandedTransactionId}
        setExpandedTransactionId={setExpandedTransactionId}
        onTransactionItemClick={onTransactionItemClick}
        onRestoreClick={onRestoreClick}
        onDeleteClick={onDeleteClick}
        onAttachmentClick={onAttachmentClick!}
      />
    </div>
  );
}

export const renderItemContent = (
  index: number,
  groupIndex: number,
  _item: unknown,
  context: VirtuosoContext,
) => {
  return (
    <TransactionVirtuosoItem
      index={index}
      groupIndex={groupIndex}
      groupedTransactions={context.groupedTransactions}
      flatItems={context.flatItems}
      assetId={context.assetId}
      expandedTransactionId={context.expandedTransactionId}
      setExpandedTransactionId={context.setExpandedTransactionId}
      onTransactionItemClick={context.onTransactionItemClick}
      onRestoreClick={context.onRestoreClick}
      onDeleteClick={context.onDeleteClick}
      onAttachmentClick={context.onAttachmentClick}
    />
  );
};
