import { cookies } from "next/headers";
import type { Category } from "@/shared/lib/types/category.type";
import CategoryContainer from "./CategoryContainer";
import { getCategoriesServer } from "../services/category.server";

export default async function CategoriesRouteContainer() {
  const cookieStore = await cookies();

  if (!cookieStore.has("access_token")) {
    return <CategoryContainer />;
  }

  const initialCategories = await getCategoriesServer(true);
  if (!initialCategories) {
    throw new Error("Failed to load authenticated categories");
  }

  return (
    <CategoryContainer initialCategories={initialCategories as Category[]} />
  );
}
