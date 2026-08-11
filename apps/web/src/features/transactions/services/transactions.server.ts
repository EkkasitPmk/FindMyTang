import { cookies } from "next/headers";
import { cache } from "react";
import { z } from "zod";
import {
  paginatedTransactionResponseSchema,
  transactionResponseSchema,
} from "../schemas/transaction.response.schema";
import type { TransactionQuery } from "@/shared/lib/types/transaction.type";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_URL_BACKEND?.replace("/api/v1", "") ??
  "http://localhost:3001";

const toSearchParams = (query: TransactionQuery) => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) params.set(key, String(value));
  });

  return params.toString();
};

const getTransactionsServerByQuery = cache(
  async function getTransactionsServerByQuery(queryString: string) {
    try {
      const cookieStore = await cookies();
      if (!cookieStore.has("access_token")) return null;

      const transactionsUrl = `${BACKEND_URL}/api/v1/transactions`;
      const url = queryString
        ? `${transactionsUrl}?${queryString}`
        : transactionsUrl;
      const response = await fetch(url, {
        headers: { cookie: cookieStore.toString() },
        cache: "no-store",
      });

      if (!response.ok) return null;

      return paginatedTransactionResponseSchema.parse(await response.json());
    } catch (error) {
      console.error("Failed to load transactions on the server", error);
      return null;
    }
  },
);

export async function getTransactionsServer(query: TransactionQuery = {}) {
  return getTransactionsServerByQuery(toSearchParams(query));
}

const availableDatesSchema = z.record(z.string(), z.array(z.string()));

export const getAvailableDatesServer = cache(
  async function getAvailableDatesServer(assetId: string) {
    try {
      const cookieStore = await cookies();
      if (!cookieStore.has("access_token")) return null;

      const params = new URLSearchParams({ assetId, isDeleted: "false" });
      const response = await fetch(
        `${BACKEND_URL}/api/v1/transactions/available-dates?${params}`,
        {
          headers: { cookie: cookieStore.toString() },
          cache: "no-store",
        },
      );

      if (!response.ok) return null;

      return availableDatesSchema.parse(await response.json());
    } catch (error) {
      console.error(
        "Failed to load available transaction dates on the server",
        error,
      );
      return null;
    }
  },
);

export const getTransactionServer = cache(async function getTransactionServer(
  id: string,
) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.has("access_token")) return null;

    const response = await fetch(`${BACKEND_URL}/api/v1/transactions/${id}`, {
      headers: { cookie: cookieStore.toString() },
      cache: "no-store",
    });

    if (!response.ok) return null;

    return transactionResponseSchema.parse(await response.json());
  } catch (error) {
    console.error("Failed to load transaction on the server", error);
    return null;
  }
});

export function getRecentTransactionsServer() {
  return getTransactionsServer({
    limit: 5,
    sortType: "DATE_NEWEST",
  });
}
