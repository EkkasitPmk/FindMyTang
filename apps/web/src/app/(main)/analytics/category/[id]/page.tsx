import DrilldownRouteContainer from "@/features/analytics/containers/DrilldownRouteContainer";
import { getCurrentPeriod } from "@/shared/lib/helpers/date.helper";

export default async function CategoryDrilldownPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPeriod = getCurrentPeriod();

  const month = resolvedSearchParams?.month
    ? Number(resolvedSearchParams.month)
    : currentPeriod.month;

  const year = resolvedSearchParams?.year
    ? Number(resolvedSearchParams.year)
    : currentPeriod.year;

  return <DrilldownRouteContainer categoryId={id} month={month} year={year} />;
}
