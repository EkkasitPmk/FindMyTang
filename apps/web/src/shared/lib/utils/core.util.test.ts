import { describe, it, expect } from "vitest";
import { cn } from "./core.util";

describe("core.util", () => {
  describe("cn", () => {
    it("should merge tailwind classes correctly", () => {
      // Test basic concatenation
      expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");

      // Test tailwind-merge (overriding classes)
      expect(cn("px-2 py-1 bg-red-500", "p-3 bg-blue-500")).toBe(
        "p-3 bg-blue-500",
      );

      // Test conditional classes (clsx functionality)
      const isTrue = true;
      const isFalse = false;
      expect(
        cn("base-class", isTrue && "truthy-class", isFalse && "falsy-class"),
      ).toBe("base-class truthy-class");
    });
  });
});
