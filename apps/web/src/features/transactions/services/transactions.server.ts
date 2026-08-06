import { cookies } from "next/headers";
import { paginatedTransactionResponseSchema } from "../schemas/transaction.response.schema";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_URL_BACKEND?.replace("/api/v1", "") ??
  "http://localhost:3001";

export async function getRecentTransactionsServer() {
  const cookieStore = await cookies();
  if (!cookieStore.has("access_token")) return null;

  const response = await fetch(
    `${BACKEND_URL}/api/v1/transactions?limit=5&sortType=DATE_NEWEST`,
    {
      headers: { cookie: cookieStore.toString() },
      cache: "no-store",
    },
  );

  if (!response.ok) return null;

  return paginatedTransactionResponseSchema.parse(await response.json());
}
