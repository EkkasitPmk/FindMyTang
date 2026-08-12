import { Suspense } from "react";
import CategoriesPageSkeleton from "@/features/category/components/CategoriesPageSkeleton";
import CategoriesRouteContainer from "@/features/category/containers/CategoriesRouteContainer";

export const metadata = {
  title: "Categories - FindMyTang",
  description: "Manage your custom financial transaction categories.",
};

export default function CategoriesPage() {
  return (
    <Suspense fallback={<CategoriesPageSkeleton />}>
      <CategoriesRouteContainer />
    </Suspense>
  );
}
