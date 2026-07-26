import TransactionListSkeleton from "../skeletons/TransactionListSkeleton";
import { VirtuosoContext } from "./TransactionList";

export interface TransactionVirtuosoFooterProps {
  context?: VirtuosoContext;
}

export function TransactionVirtuosoFooter({
  context,
}: Readonly<TransactionVirtuosoFooterProps>) {
  if (!context?.isFetchingNextPage) return null;

  return (
    <div className="py-4 space-y-1">
      <TransactionListSkeleton />
    </div>
  );
}
