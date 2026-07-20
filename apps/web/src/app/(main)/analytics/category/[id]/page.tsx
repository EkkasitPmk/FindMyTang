import { DrilldownContainer } from "@/features/analytics/containers/DrilldownContainer";

export default async function CategoryDrilldownPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  return <DrilldownContainer categoryId={id} />;
}
