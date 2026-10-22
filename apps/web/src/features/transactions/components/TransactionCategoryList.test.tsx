import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TransactionCategoryList from "./TransactionCategoryList";
import type { Category } from "@/shared/lib/types/category.type";

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("TransactionCategoryList", () => {
  const mockCategories: Category[] = [
    {
      id: "cat-1",
      name: "Food",
      icon: "Utensils",
      color: "#FF5733",
      type: "EXPENSE",
      isSystem: false,
    },
    {
      id: "cat-2",
      name: "Transport",
      icon: "Car",
      color: "#33FF57",
      type: "EXPENSE",
      isSystem: false,
    },
  ];

  it("renders categories and handles selection", () => {
    const handleSelect = vi.fn();
    render(
      <TransactionCategoryList
        categories={mockCategories}
        activeCategoryId="cat-1"
        onSelectCategory={handleSelect}
      />,
    );

    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Transport")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Transport"));
    expect(handleSelect).toHaveBeenCalledWith("cat-2");
  });

  it("renders custom label and container class name", () => {
    render(
      <TransactionCategoryList
        categories={mockCategories}
        activeCategoryId={null}
        onSelectCategory={vi.fn()}
        label="Custom Category *"
        containerClassName="px-0"
      />,
    );

    expect(screen.getByText("Custom Category *")).toBeInTheDocument();
  });

  it("renders edit button when onEditClick is provided", () => {
    const handleEdit = vi.fn();
    render(
      <TransactionCategoryList
        categories={mockCategories}
        activeCategoryId={null}
        onSelectCategory={vi.fn()}
        onEditClick={handleEdit}
      />,
    );

    const editBtn = screen.getByText("edit");
    expect(editBtn).toBeInTheDocument();
    fireEvent.click(editBtn);
    expect(handleEdit).toHaveBeenCalledTimes(1);
  });

  it("does not render edit button when onEditClick is not provided", () => {
    render(
      <TransactionCategoryList
        categories={mockCategories}
        activeCategoryId={null}
        onSelectCategory={vi.fn()}
      />,
    );

    expect(screen.queryByText("edit")).not.toBeInTheDocument();
  });
});
