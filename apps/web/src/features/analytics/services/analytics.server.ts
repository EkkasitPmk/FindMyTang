import { cookies } from "next/headers";
import { cache } from "react";
import { BACKEND_URL } from "@/shared/lib/configs/backend.config";
import {
  assetDistributionResponseSchema,
  categoryBreakdownResponseSchema,
  drilldownResponseSchema,
  monthlyTrendsResponseSchema,
} from "../schemas/analytics.response.schema";

type CategoryType = "INCOME" | "EXPENSE" | "TRANSFER" | "ADJUSTMENT";

const getAnalyticsServer = async <T>(
  path: string,
  schema: { parse: (data: unknown) => T },
) => {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.has("access_token")) return null;

    const response = await fetch(`${BACKEND_URL}/api/v1${path}`, {
      headers: { cookie: cookieStore.toString() },
      cache: "no-store",
    });

    if (!response.ok) return null;

    return schema.parse(await response.json());
  } catch (error) {
    console.error(`Failed to load analytics data for ${path}`, error);
    return null;
  }
};

export const getCategoryBreakdownServer = cache(
  async function getCategoryBreakdownServer(
    month: number,
    year: number,
    type: CategoryType = "EXPENSE",
  ) {
    return getAnalyticsServer(
      `/analytics/categories?month=${month}&year=${year}&type=${type}`,
      categoryBreakdownResponseSchema,
    );
  },
);

export const getMonthlyTrendsServer = cache(
  async function getMonthlyTrendsServer(year: number) {
    return getAnalyticsServer(
      `/analytics/trends?year=${year}`,
      monthlyTrendsResponseSchema,
    );
  },
);

export const getAssetDistributionServer = cache(
  async function getAssetDistributionServer() {
    return getAnalyticsServer(
      "/analytics/assets",
      assetDistributionResponseSchema,
    );
  },
);

export const getDrilldownServer = cache(async function getDrilldownServer(
  categoryId: string,
  month: number,
  year: number,
) {
  return getAnalyticsServer(
    `/analytics/categories/${encodeURIComponent(categoryId)}/transactions?month=${month}&year=${year}`,
    drilldownResponseSchema,
  );
});
