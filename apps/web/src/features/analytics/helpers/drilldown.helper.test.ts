import { describe, expect, it } from "vitest";
import {
  getAssetBadgeStyle,
  getTxAmountDisplay,
  getTxTime,
  groupTransactionsByDate,
} from "./drilldown.helper";
import { DrilldownTransaction } from "../schemas/analytics.response.schema";

describe("drilldown.helper", () => {
  describe("getTxTime", () => {
    it("returns null for midnight or T00:00:00", () => {
      expect(getTxTime("2026-09-30T00:00:00.000Z")).toBeNull();
    });

    it("returns HH:mm when time is present", () => {
      // Create local date with specific time
      const date = new Date(2026, 8, 30, 14, 25);
      expect(getTxTime(date.toISOString())).toBe("14:25");
    });
  });

  describe("getTxAmountDisplay", () => {
    it("returns neutral prefix and primary text color for TRANSFER", () => {
      expect(getTxAmountDisplay("TRANSFER", 100)).toEqual({
        signPrefix: "",
        colorClass: "text-primary-text",
      });
    });

    it("returns + and text-income for INCOME", () => {
      expect(getTxAmountDisplay("INCOME", 500)).toEqual({
        signPrefix: "+",
        colorClass: "text-income",
      });
    });

    it("returns - and text-expense for EXPENSE", () => {
      expect(getTxAmountDisplay("EXPENSE", 250)).toEqual({
        signPrefix: "-",
        colorClass: "text-expense",
      });
    });

    it("handles positive and negative adjustments correctly", () => {
      expect(getTxAmountDisplay("ADJUSTMENT", 50)).toEqual({
        signPrefix: "+",
        colorClass: "text-income",
      });
      expect(getTxAmountDisplay("ADJUSTMENT", -79)).toEqual({
        signPrefix: "-",
        colorClass: "text-expense",
      });
    });
  });

  describe("getAssetBadgeStyle", () => {
    it("formats hex colors with alpha", () => {
      const style = getAssetBadgeStyle("#16a34a");
      expect(style.color).toBe("#16a34a");
      expect(style.backgroundColor).toBe("#16a34a1A");
    });

    it("fallbacks to CSS variables when color is missing or non-hex", () => {
      const style = getAssetBadgeStyle();
      expect(style.color).toBe("var(--chart-2)");
      expect(style.backgroundColor).toBe("var(--surface-secondary)");
    });
  });

  describe("groupTransactionsByDate", () => {
    it("groups transactions by date correctly", () => {
      const tx1: DrilldownTransaction = {
        id: "1",
        amount: 100,
        date: new Date(2026, 8, 30, 10, 0).toISOString(),
        type: "EXPENSE",
        asset: { id: "a1", name: "Cash", type: "CASH" },
      };
      const tx2: DrilldownTransaction = {
        id: "2",
        amount: 50,
        date: new Date(2026, 8, 30, 11, 0).toISOString(),
        type: "EXPENSE",
        asset: { id: "a1", name: "Cash", type: "CASH" },
      };

      const grouped = groupTransactionsByDate([tx1, tx2]);
      const dateKeys = Object.keys(grouped);
      expect(dateKeys).toHaveLength(1);
      expect(grouped[dateKeys[0]].txs).toHaveLength(2);
    });
  });
});
