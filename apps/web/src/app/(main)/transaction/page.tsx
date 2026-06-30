import { Suspense } from "react";
import TransactionsContainer from "@/features/transactions/containers/TransactionsContainer";
import TransactionSkeleton from "@/features/transactions/components/TransactionSkeleton";

export default function TransactionPage() {
  return (
    <Suspense fallback={<TransactionSkeleton />}>
      <TransactionsContainer />
    </Suspense>
  );
}
