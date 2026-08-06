import { cookies } from "next/headers";
import RecentJournalContainer from "./RecentJournalContainer";
import type {
  GroupedTransaction,
  PaginatedTransactionResponse,
} from "@/shared/lib/types/transaction.type";

export default async function RecentJournalServer({
  initialTransactions,
}: Readonly<{ initialTransactions?: PaginatedTransactionResponse }>) {
  if (!initialTransactions) return <RecentJournalContainer />;

  const locale =
    (await cookies()).get("findmytang-language")?.value === "th"
      ? "th-TH"
      : "en-US";
  const groups = new Map<string, PaginatedTransactionResponse["items"]>();

  for (const transaction of initialTransactions.items) {
    const dateStr = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(transaction.transactionDate));
    const items = groups.get(dateStr) ?? [];
    items.push(transaction);
    groups.set(dateStr, items);
  }

  const groupedTransactions: GroupedTransaction[] = Array.from(
    groups.entries(),
  ).map(([dateStr, items]) => ({ dateStr, items }));

  return (
    <RecentJournalContainer initialGroupedTransactions={groupedTransactions} />
  );
}
