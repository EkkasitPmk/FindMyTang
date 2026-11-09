import { beforeEach, describe, it, expect, vi } from "vitest";
import {
  reorderCategoriesList,
  getTargetIndexFromTouch,
} from "./category.helper";
import { Category } from "@/shared/lib/types/category.type";

vi.mock("react-toastify", () => ({ toast: { error: vi.fn() } }));

describe("category.helper", () => {
  beforeEach(() => {
    document.elementFromPoint = vi.fn();
  });
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

  describe("getTargetIndexFromTouch", () => {
    it("returns null if there are no touches", () => {
      const mockEvent = {
        touches: [] as unknown as TouchList,
      } as unknown as React.TouchEvent;

      expect(getTargetIndexFromTouch(mockEvent)).toBeNull();
    });

    it("returns null if no element is found at touch point or no [data-index] ancestor", () => {
      vi.spyOn(document, "elementFromPoint").mockReturnValue(null);
      const mockEvent = {
        touches: [{ clientX: 10, clientY: 20 }] as unknown as TouchList,
      } as unknown as React.TouchEvent;

      expect(getTargetIndexFromTouch(mockEvent)).toBeNull();

      const elementWithoutDataIndex = document.createElement("div");
      vi.spyOn(document, "elementFromPoint").mockReturnValue(
        elementWithoutDataIndex,
      );
      expect(getTargetIndexFromTouch(mockEvent)).toBeNull();
    });

    it("returns null if dataset.index is missing or NaN", () => {
      const elementWithEmptyIndex = document.createElement("div");
      elementWithEmptyIndex.setAttribute("data-index", "invalid-number");
      vi.spyOn(document, "elementFromPoint").mockReturnValue(
        elementWithEmptyIndex,
      );

      const mockEvent = {
        touches: [{ clientX: 10, clientY: 20 }] as unknown as TouchList,
      } as unknown as React.TouchEvent;

      expect(getTargetIndexFromTouch(mockEvent)).toBeNull();

      const mockElWithoutIndex = {
        dataset: {},
        closest: vi.fn(() => mockElWithoutIndex),
      } as unknown as HTMLElement;
      vi.spyOn(document, "elementFromPoint").mockReturnValue(
        mockElWithoutIndex,
      );
      expect(getTargetIndexFromTouch(mockEvent)).toBeNull();
    });

    it("returns the parsed integer when element has valid data-index", () => {
      const targetElement = document.createElement("div");
      targetElement.setAttribute("data-index", "3");
      vi.spyOn(document, "elementFromPoint").mockReturnValue(targetElement);

      const mockEvent = {
        touches: [{ clientX: 50, clientY: 100 }] as unknown as TouchList,
      } as unknown as React.TouchEvent;

      expect(getTargetIndexFromTouch(mockEvent)).toBe(3);
    });
  });
});
