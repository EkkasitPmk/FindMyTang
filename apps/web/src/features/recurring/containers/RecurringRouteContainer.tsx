import { cookies } from "next/headers";
import type { RecurringExpense } from "@/shared/lib/types/recurring.type";
import RecurringContainer from "./RecurringContainer";
import { getRecurringExpensesServer } from "../services/recurring.server";

export default async function RecurringRouteContainer() {
  const cookieStore = await cookies();

  if (!cookieStore.has("access_token") && !cookieStore.has("refresh_token")) {
    return <RecurringContainer />;
  }

  const initialItems = await getRecurringExpensesServer(false);

  return (
    <RecurringContainer
      initialItems={(initialItems as RecurringExpense[]) ?? undefined}
    />
  );
}
