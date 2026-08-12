import { cookies } from "next/headers";
import { cache } from "react";
import { BACKEND_URL } from "@/shared/lib/configs/backend.config";
import { categoryListResponseSchema } from "../schemas/category.response.schema";

export const getCategoriesServer = cache(async function getCategoriesServer(
  includeDeleted = true,
) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.has("access_token")) return null;

    const query = includeDeleted ? "?includeDeleted=true" : "";
    const response = await fetch(`${BACKEND_URL}/api/v1/categories${query}`, {
      headers: { cookie: cookieStore.toString() },
      cache: "no-store",
    });

    if (!response.ok) return null;

    return categoryListResponseSchema.parse(await response.json());
  } catch (error) {
    console.error("Failed to load categories on the server", error);
    return null;
  }
});
