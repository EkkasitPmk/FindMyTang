import { cookies } from "next/headers";
import { todaySummaryResponseSchema } from "../schemas/dashboard.response.schema";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_URL_BACKEND?.replace("/api/v1", "") ??
  "http://localhost:3001";

export async function getThisMonthSummaryServer() {
  const cookieStore = await cookies();
  if (!cookieStore.has("access_token")) return null;

  const response = await fetch(`${BACKEND_URL}/api/v1/summary/monthly`, {
    headers: { cookie: cookieStore.toString() },
    cache: "no-store",
  });

  if (!response.ok) return null;

  return todaySummaryResponseSchema.parse(await response.json());
}
