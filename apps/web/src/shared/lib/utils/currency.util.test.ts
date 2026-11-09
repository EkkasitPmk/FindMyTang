import { describe, it, expect } from "vitest";
import {
  getFormattedAmount,
  parseAmountDigits,
  convertDigitsToAmount,
  convertAmountToDigits,
  formatCompactCurrency,
  formatCurrency,
  formatAmount,
  formatNet,
} from "./currency.util";

describe("currency.util", () => {
  describe("formatCurrency", () => {
    it("formats amounts in THB currency format", () => {
      const formatted = formatCurrency(1250.5);
      expect(formatted).toContain("1,250.5");
      expect(formatted).toMatch(/฿|THB/);
    });
  });

  describe("formatAmount", () => {
    it("formats positive amount with currency prefix and 2 decimals", () => {
      expect(formatAmount(1250.5)).toBe("฿1,250.50");
    });

    it("formats negative amount as absolute with currency prefix", () => {
      expect(formatAmount(-50)).toBe("฿50.00");
    });

    it("formats with custom locale", () => {
      expect(formatAmount(1250.5, "th-TH")).toBe("฿1,250.50");
    });
  });

  describe("formatNet", () => {
    it("formats positive amount with + sign", () => {
      expect(formatNet(1250.5)).toBe("+฿1,250.50");
    });

    it("formats zero with + sign", () => {
      expect(formatNet(0)).toBe("+฿0.00");
    });

    it("formats negative amount with - sign", () => {
      expect(formatNet(-42.1)).toBe("-฿42.10");
    });

    it("formats with custom locale", () => {
      expect(formatNet(100, "th-TH")).toBe("+฿100.00");
    });
  });

  describe("formatCompactCurrency", () => {
    it("formats small amounts without k suffix", () => {
      expect(formatCompactCurrency(75)).toBe("฿75");
      expect(formatCompactCurrency(-75)).toBe("-฿75");
      expect(formatCompactCurrency(0)).toBe("฿0");
      expect(formatCompactCurrency(500)).toBe("฿500");
    });

    it("formats thousands with K suffix and proper sign", () => {
      expect(formatCompactCurrency(1000)).toBe("฿1K");
      expect(formatCompactCurrency(-1000)).toBe("-฿1K");
      expect(formatCompactCurrency(7500)).toBe("฿7.5K");
      expect(formatCompactCurrency(-7500)).toBe("-฿7.5K");
    });

    it("formats millions with M suffix", () => {
      expect(formatCompactCurrency(1500000)).toBe("฿1.5M");
    });
  });

  describe("getFormattedAmount", () => {
    it("returns empty strings if input is empty", () => {
      const result = getFormattedAmount("");
      expect(result).toEqual({ displayAmount: "", numericAmount: "" });
    });

    it("formats 1 digit correctly (cents)", () => {
      const result = getFormattedAmount("5");
      expect(result).toEqual({ displayAmount: "0.05", numericAmount: "0.05" });
    });

    it("formats 3 digits correctly", () => {
      const result = getFormattedAmount("123");
      expect(result).toEqual({ displayAmount: "1.23", numericAmount: "1.23" });
    });

    it("formats thousands with commas", () => {
      const result = getFormattedAmount("123456");
      expect(result).toEqual({
        displayAmount: "1,234.56",
        numericAmount: "1234.56",
      });
    });
  });

  describe("parseAmountDigits", () => {
    it("removes non-digit characters", () => {
      expect(parseAmountDigits("a1b2c3")).toBe("123");
    });

    it("removes leading zeros", () => {
      expect(parseAmountDigits("000123")).toBe("123");
    });

    it("limits to 10 digits", () => {
      expect(parseAmountDigits("123456789012")).toBe("1234567890");
    });
  });

  describe("convertDigitsToAmount", () => {
    it("returns 0 for empty string", () => {
      expect(convertDigitsToAmount("")).toBe(0);
    });

    it("converts digits to correct float value", () => {
      expect(convertDigitsToAmount("123")).toBe(1.23);
      expect(convertDigitsToAmount("5")).toBe(0.05);
    });
  });

  describe("convertAmountToDigits", () => {
    it("converts float to string of digits", () => {
      expect(convertAmountToDigits(1.23)).toBe("123");
      expect(convertAmountToDigits(0.05)).toBe("5");
    });

    it("handles zero", () => {
      expect(convertAmountToDigits(0)).toBe("0");
    });

    it("handles negative values by converting to absolute", () => {
      expect(convertAmountToDigits(-1.23)).toBe("123");
    });
  });
});
