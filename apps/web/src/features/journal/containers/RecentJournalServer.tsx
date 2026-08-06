import RecentJournalContainer from "./RecentJournalContainer";
import type { PaginatedTransactionResponse } from "@/shared/lib/types/transaction.type";

export default async function RecentJournalServer({
  initialTransactions,
}: Readonly<{ initialTransactions?: PaginatedTransactionResponse }>) {
  return <RecentJournalContainer initialTransactions={initialTransactions} />;
}
