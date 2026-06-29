import { Suspense } from "react";
import TransactionsContainer from "@/features/transactions/containers/TransactionsContainer";

export default function TransactionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransactionsContainer />
    </Suspense>
  );
}
