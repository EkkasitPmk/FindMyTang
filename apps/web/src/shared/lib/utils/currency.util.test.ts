import { describe, it, expect } from "vitest";
import {
  getFormattedAmount,
  parseAmountDigits,
  convertDigitsToAmount,
  convertAmountToDigits,
} from "./currency.util";

describe("currency.util", () => {
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
