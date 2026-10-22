import { cookies } from "next/headers";
import { cache } from "react";
import { BACKEND_URL } from "@/shared/lib/configs/backend.config";
import { recurringExpenseListResponseSchema } from "../schemas/recurring.response.schema";

export const getRecurringExpensesServer = cache(
  async function getRecurringExpensesServer(includeDeleted = false) {
    try {
      const cookieStore = await cookies();
      if (!cookieStore.has("access_token")) return null;

      const query = includeDeleted ? "?includeDeleted=true" : "";
      const response = await fetch(
        `${BACKEND_URL}/api/v1/recurring-expenses${query}`,
        {
          headers: { cookie: cookieStore.toString() },
          cache: "no-store",
        },
      );

      if (!response.ok) return null;

      return recurringExpenseListResponseSchema.parse(await response.json());
    } catch (error) {
      console.error("Failed to load recurring expenses on the server", error);
      return null;
    }
  },
);
