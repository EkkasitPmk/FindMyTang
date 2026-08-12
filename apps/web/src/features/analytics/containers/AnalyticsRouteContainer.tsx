import { cookies } from "next/headers";
import AnalyticsContainer from "./AnalyticsContainer";
import { getCategoryBreakdownServer } from "../services/analytics.server";

export default async function AnalyticsRouteContainer() {
  const cookieStore = await cookies();
  if (!cookieStore.has("access_token")) return <AnalyticsContainer />;

  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const initialCategoryBreakdown = await getCategoryBreakdownServer(
    month,
    year,
    "EXPENSE",
  );

  if (!initialCategoryBreakdown) {
    throw new Error("Failed to load authenticated analytics data");
  }

  return (
    <AnalyticsContainer
      initialCategoryBreakdown={initialCategoryBreakdown}
      initialMonth={month}
      initialYear={year}
    />
  );
}
