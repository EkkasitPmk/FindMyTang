import { describe, expect, it } from "vitest";
import { AssetType } from "@/shared/lib/types/asset.type";
import { createAssetSchema, editAssetSchema } from "./assets.form.schema";

describe("assets.form.schema", () => {
  describe("createAssetSchema", () => {
    it("validates a valid asset with default and optional fields", () => {
      const result = createAssetSchema.safeParse({
        name: "Main Bank",
        type: AssetType.BANK,
        balance: 5000,
        savingsAmount: 1000,
        color: "#123456",
        includeInSnapshot: false,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.balance).toBe(5000);
        expect(result.data.savingsAmount).toBe(1000);
        expect(result.data.includeInSnapshot).toBe(false);
      }
    });

    it("accepts string formatted balances and handles commas", () => {
      const result = createAssetSchema.safeParse({
        name: "Cash",
        type: AssetType.CASH,
        balance: "1,234,567.89",
        savingsAmount: "12,345.00",
      });

      expect(result.success).toBe(true);
    });

    it("accepts empty, null, and undefined balance and savingsAmount", () => {
      for (const val of ["", null, undefined]) {
        const result = createAssetSchema.safeParse({
          name: "Wallet",
          type: AssetType.CASH,
          balance: val,
          savingsAmount: val,
        });

        expect(result.success).toBe(true);
      }
    });

    it("rejects invalid asset name", () => {
      const emptyRes = createAssetSchema.safeParse({
        name: "",
        type: AssetType.CASH,
      });
      expect(emptyRes.success).toBe(false);

      const whitespaceRes = createAssetSchema.safeParse({
        name: "   ",
        type: AssetType.CASH,
      });
      expect(whitespaceRes.success).toBe(false);

      const tooLongRes = createAssetSchema.safeParse({
        name: "a".repeat(31),
        type: AssetType.CASH,
      });
      expect(tooLongRes.success).toBe(false);
    });

    it("rejects invalid asset type", () => {
      const result = createAssetSchema.safeParse({
        name: "Crypto",
        type: "INVALID_TYPE",
      });
      expect(result.success).toBe(false);
    });

    it("validates balance constraints (number parsing, minimum, and maximum)", () => {
      const nanRes = createAssetSchema.safeParse({
        name: "Bank",
        type: AssetType.BANK,
        balance: "not-a-number",
      });
      expect(nanRes.success).toBe(false);

      const belowMinRes = createAssetSchema.safeParse({
        name: "Bank",
        type: AssetType.BANK,
        balance: 0.5,
      });
      expect(belowMinRes.success).toBe(false);

      const aboveMaxRes = createAssetSchema.safeParse({
        name: "Bank",
        type: AssetType.BANK,
        balance: 100_000_000,
      });
      expect(aboveMaxRes.success).toBe(false);
    });

    it("validates savingsAmount constraints (number parsing, minimum, and maximum)", () => {
      const nanRes = createAssetSchema.safeParse({
        name: "Savings",
        type: AssetType.BANK,
        savingsAmount: "invalid",
      });
      expect(nanRes.success).toBe(false);

      const belowMinRes = createAssetSchema.safeParse({
        name: "Savings",
        type: AssetType.BANK,
        savingsAmount: -1,
      });
      expect(belowMinRes.success).toBe(false);

      const aboveMaxRes = createAssetSchema.safeParse({
        name: "Savings",
        type: AssetType.BANK,
        savingsAmount: 100_000_000,
      });
      expect(aboveMaxRes.success).toBe(false);
    });
  });

  describe("editAssetSchema", () => {
    it("validates edit schema successfully", () => {
      const result = editAssetSchema.safeParse({
        name: "Updated Bank",
        type: AssetType.BANK,
        balance: null,
      });

      expect(result.success).toBe(true);
    });
  });
});
