import { describe, it, expect, vi } from "vitest";
import { reorderCategoriesList } from "./category.helper";
import { Category } from "@/shared/lib/types/category.type";

vi.mock("react-toastify", () => ({ toast: { error: vi.fn() } }));

describe("category.helper", () => {
  describe("reorderCategoriesList", () => {
    it("should properly reorder categories in the active tab without affecting other tabs", () => {
      const categories: Category[] = [
        {
          id: "1",
          type: "EXPENSE",
          name: "E1",
          displayOrder: 0,
          createdAt: "",
          updatedAt: "",
          userId: "test-user",
          isSystem: false,
        },
        {
          id: "2",
          type: "EXPENSE",
          name: "E2",
          displayOrder: 1,
          createdAt: "",
          updatedAt: "",
          userId: "test-user",
          isSystem: false,
        },
        {
          id: "3",
          type: "EXPENSE",
          name: "E3",
          displayOrder: 2,
          createdAt: "",
          updatedAt: "",
          userId: "test-user",
          isSystem: false,
        },
        {
          id: "4",
          type: "INCOME",
          name: "I1",
          displayOrder: 0,
          createdAt: "",
          updatedAt: "",
          userId: "test-user",
          isSystem: false,
        },
      ];

      // Drag E3 (index 2) to E1 (index 0) in EXPENSE tab
      const reordered = reorderCategoriesList(categories, "EXPENSE", 2, 0);

      // The new array has the EXPENSE items first (reordered), then the INCOME items
      expect(reordered[0].id).toBe("3");
      expect(reordered[1].id).toBe("1");
      expect(reordered[2].id).toBe("2");
      expect(reordered[3].id).toBe("4");
    });
  });
});
