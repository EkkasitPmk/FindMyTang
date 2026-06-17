import CategoryContainer from "@/features/category/containers/CategoryContainer";

export const metadata = {
  title: "Categories - PocketNote",
  description: "Manage your custom financial transaction categories.",
};

export default function CategoriesPage() {
  return (
    <div className="space-y-stack-gap-lg animate-in fade-in duration-300">
      <div>
        <h1 className="font-headline-lg text-on-surface">Categories</h1>
        <p className="font-body-sm text-on-surface-variant mt-1">
          Create and organize labels for tracking your incomes and expenses
        </p>
      </div>
      <CategoryContainer />
    </div>
  );
}
