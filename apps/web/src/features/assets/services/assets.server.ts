import { cookies } from "next/headers";
import { cache } from "react";
import { assetListResponseSchema } from "../schemas/assets.response.schema";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_URL_BACKEND?.replace("/api/v1", "") ??
  "http://localhost:3001";

export const getAssetsServer = cache(async function getAssetsServer(
  includeDeleted = false,
) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.has("access_token")) return null;

    const query = includeDeleted ? "?includeDeleted=true" : "";
    const response = await fetch(`${BACKEND_URL}/api/v1/assets${query}`, {
      headers: { cookie: cookieStore.toString() },
      cache: "no-store",
    });

    if (!response.ok) return null;

    return assetListResponseSchema.parse(await response.json());
  } catch (error) {
    console.error("Failed to load assets on the server", error);
    return null;
  }
});
