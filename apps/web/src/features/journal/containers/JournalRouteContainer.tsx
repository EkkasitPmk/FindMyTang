import { cookies } from "next/headers";
import type { PaginatedTransactionResponse } from "@/shared/lib/types/transaction.type";
import { getTransactionsServer } from "@/features/transactions/services/transactions.server";
import JournalContainer from "./JournalContainer";

const INITIAL_JOURNAL_QUERY = {
  limit: 30,
  pagination: "cursor" as const,
  isDeleted: false,
  sortType: "DATE_NEWEST",
};

export default async function JournalRouteContainer() {
  const cookieStore = await cookies();

  const isCandidateAuth =
    cookieStore.has("access_token") || cookieStore.has("refresh_token");

  if (!isCandidateAuth) {
    return <JournalContainer />;
  }

  const initialTransactions = await getTransactionsServer(
    INITIAL_JOURNAL_QUERY,
  );

  return (
    <JournalContainer
      initialTransactions={
        (initialTransactions as PaginatedTransactionResponse) ?? undefined
      }
    />
  );
}
