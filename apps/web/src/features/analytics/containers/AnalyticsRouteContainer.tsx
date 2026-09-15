import { cookies } from "next/headers";
import AnalyticsContainer from "./AnalyticsContainer";
import { getCategoryBreakdownServer } from "../services/analytics.server";

export default async function AnalyticsRouteContainer() {
  const cookieStore = await cookies();

  const isCandidateAuth =
    cookieStore.has("access_token") || cookieStore.has("refresh_token");

  if (!isCandidateAuth) return <AnalyticsContainer />;

  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const initialCategoryBreakdown = await getCategoryBreakdownServer(
    month,
    year,
    "EXPENSE",
  );

  return (
    <AnalyticsContainer
      initialCategoryBreakdown={initialCategoryBreakdown ?? undefined}
      initialMonth={month}
      initialYear={year}
    />
  );
}
