import { describe, expect, it } from "vitest";
import {
  calculateNetTotal,
  getTopRowText,
  getNetTotalConfig,
} from "./transaction-list.helper";
import { TransactionResponse } from "@/shared/lib/types/transaction.type";

const transaction = (type: TransactionResponse["type"], amount: number) =>
  ({ type, amount }) as TransactionResponse;

describe("transaction-list.helper", () => {
  describe("calculateNetTotal", () => {
    it("sums income, subtracts expense, adds adjustment, and ignores transfer", () => {
      expect(
        calculateNetTotal([
          transaction("INCOME", 1000),
          transaction("TRANSFER", 500),
          transaction("EXPENSE", 200),
          transaction("ADJUSTMENT", 50),
          transaction("ADJUSTMENT", -20),
        ]),
      ).toBe(830);
    });
  });

  describe("getTopRowText", () => {
    const t = (key: string) => `trans_${key}`;

    it("returns empty string when diffDays is null", () => {
      expect(getTopRowText(null, t)).toBe("");
    });

    it("handles today, yesterday, and tomorrow exact matches", () => {
      expect(getTopRowText(0, t)).toBe("trans_today");
      expect(getTopRowText(-1, t)).toBe("trans_yesterday");
      expect(getTopRowText(1, t)).toBe("trans_tomorrow");
    });

    it("handles future weeks (1, 2, 3, and generic)", () => {
      expect(getTopRowText(7, t)).toBe("trans_in1Week");
      expect(getTopRowText(14, t)).toBe("trans_in2Weeks");
      expect(getTopRowText(21, t)).toBe("trans_in3Weeks");

      const tWithInterpolation = (key: string) => `[${key}]`;
      expect(getTopRowText(28, tWithInterpolation)).toBe("[inWeeks]");
    });

    it("handles past weeks (1 week ago and multiple weeks ago)", () => {
      expect(getTopRowText(-7, t)).toBe("trans_oneWeekAgo");

      const tWithInterpolation = (key: string) => `[${key}]`;
      expect(getTopRowText(-14, tWithInterpolation)).toBe("[weeksAgo]");
    });

    it("handles future days (2, 3, and generic)", () => {
      expect(getTopRowText(2, t)).toBe("trans_in2Days");
      expect(getTopRowText(3, t)).toBe("trans_in3Days");

      const tWithInterpolation = (key: string) => `[${key}]`;
      expect(getTopRowText(4, tWithInterpolation)).toBe("[inDays]");
    });

    it("handles past days", () => {
      const tWithInterpolation = (key: string) => `[${key}]`;
      expect(getTopRowText(-2, tWithInterpolation)).toBe("[daysAgo]");
      expect(getTopRowText(-5, tWithInterpolation)).toBe("[daysAgo]");
    });
  });

  describe("getNetTotalConfig", () => {
    it("returns income config for positive total", () => {
      expect(getNetTotalConfig(150)).toEqual({
        colorClass: "text-income",
        prefix: "+",
      });
    });

    it("returns expense config for negative total", () => {
      expect(getNetTotalConfig(-50)).toEqual({
        colorClass: "text-expense",
        prefix: "-",
      });
    });

    it("returns neutral config for zero total", () => {
      expect(getNetTotalConfig(0)).toEqual({
        colorClass: "text-secondary-text",
        prefix: "",
      });
    });
  });
});
