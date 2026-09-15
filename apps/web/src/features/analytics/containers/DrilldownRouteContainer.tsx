import { cookies } from "next/headers";
import type { Asset } from "@/shared/lib/types/asset.type";
import { getAssetsServer } from "@/features/assets/services/assets.server";
import { DrilldownContainer } from "./DrilldownContainer";
import { getDrilldownServer } from "../services/analytics.server";

export default async function DrilldownRouteContainer({
  categoryId,
  month,
  year,
}: Readonly<{ categoryId: string; month: number; year: number }>) {
  const cookieStore = await cookies();

  if (!cookieStore.has("access_token") && !cookieStore.has("refresh_token")) {
    return (
      <DrilldownContainer categoryId={categoryId} month={month} year={year} />
    );
  }

  const [initialDrilldown, initialAssets] = await Promise.all([
    getDrilldownServer(categoryId, month, year),
    getAssetsServer(),
  ]);

  return (
    <DrilldownContainer
      categoryId={categoryId}
      month={month}
      year={year}
      initialDrilldown={initialDrilldown ?? undefined}
      initialAssets={(initialAssets as Asset[]) ?? undefined}
    />
  );
}
