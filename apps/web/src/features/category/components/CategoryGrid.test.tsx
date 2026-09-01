import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));

import CategoryGrid from "./CategoryGrid";
import { Category } from "@/shared/lib/types/category.type";

const dummyCallbacks = {
  onNewCategoryClick: vi.fn(),
  onCategoryClick: vi.fn(),
  onDeleteClick: vi.fn(),
  onDragStart: vi.fn(),
  onDragOver: vi.fn(),
  onDragEnd: vi.fn(),
  onTouchStart: vi.fn(),
  onTouchMove: vi.fn(),
  onTouchEnd: vi.fn(),
};

describe("CategoryGrid Empty State", () => {
  it("renders No categories found in EXPENSE tab when categories is empty (standalone mode)", () => {
    render(
      <CategoryGrid
        categories={[]}
        isEditingList={false}
        draggedIndex={null}
        showNewCategory={true}
        isDeletedTab={false}
        {...dummyCallbacks}
      />,
    );

    expect(screen.getByText("No categories found.")).toBeInTheDocument();
    expect(screen.getByText("New Category")).toBeInTheDocument();
  });

  it("renders No categories found in EXPENSE tab when categories is empty (embedded desktop mode)", () => {
    render(
      <CategoryGrid
        categories={[]}
        isEditingList={false}
        draggedIndex={null}
        showNewCategory={false}
        isDeletedTab={false}
        {...dummyCallbacks}
      />,
    );

    expect(screen.getByText("No categories found.")).toBeInTheDocument();
    expect(screen.queryByText("New Category")).not.toBeInTheDocument();
  });

  it("renders No categories found in DELETED tab when categories is empty", () => {
    render(
      <CategoryGrid
        categories={[]}
        isEditingList={false}
        draggedIndex={null}
        showNewCategory={false}
        isDeletedTab={true}
        {...dummyCallbacks}
      />,
    );

    expect(screen.getByText("No categories found.")).toBeInTheDocument();
  });

  it("does not render No categories found when categories are present", () => {
    const sampleCategory: Category = {
      id: "cat-1",
      name: "Food",
      type: "EXPENSE",
      color: "#e11d48",
      icon: "food",
      displayOrder: 1,
      isSystem: false,
      userId: "user-1",
      createdAt: "",
      updatedAt: "",
    };

    render(
      <CategoryGrid
        categories={[sampleCategory]}
        isEditingList={false}
        draggedIndex={null}
        showNewCategory={true}
        isDeletedTab={false}
        {...dummyCallbacks}
      />,
    );

    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.queryByText("No categories found.")).not.toBeInTheDocument();
  });
});
