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

  if (!cookieStore.has("access_token")) {
    return <JournalContainer />;
  }

  const initialTransactions = await getTransactionsServer(
    INITIAL_JOURNAL_QUERY,
  );
  if (!initialTransactions) {
    throw new Error("Failed to load authenticated journal data");
  }

  return (
    <JournalContainer
      initialTransactions={initialTransactions as PaginatedTransactionResponse}
    />
  );
}
