import DrilldownRouteContainer from "@/features/analytics/containers/DrilldownRouteContainer";

export default async function CategoryDrilldownPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const month = resolvedSearchParams?.month
    ? Number(resolvedSearchParams.month)
    : new Date().getMonth() + 1;

  const year = resolvedSearchParams?.year
    ? Number(resolvedSearchParams.year)
    : new Date().getFullYear();

  return <DrilldownRouteContainer categoryId={id} month={month} year={year} />;
}
