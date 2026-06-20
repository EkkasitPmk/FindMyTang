import CategoryContainer from "@/features/category/containers/CategoryContainer";

export const metadata = {
  title: "Categories - PocketNote",
  description: "Manage your custom financial transaction categories.",
};

export default function CategoriesPage() {
  return (
    <div className="animate-in fade-in duration-300">
      <div>
        <h1 className="">Categories</h1>
        <p className="text-on-surface-variant mt-1">
          Create and organize labels for tracking your incomes and expenses
        </p>
      </div>
      <CategoryContainer />
    </div>
  );
}
