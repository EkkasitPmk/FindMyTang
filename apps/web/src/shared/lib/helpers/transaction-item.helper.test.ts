import { describe, expect, it } from "vitest";
import { getAmountDisplayConfig } from "./transaction-item.helper";

describe("getAmountDisplayConfig", () => {
  it("keeps transfers neutral when no asset context is provided", () => {
    expect(getAmountDisplayConfig("TRANSFER", false, false, 100)).toEqual({
      amountColorClass: "text-primary-text",
      amountPrefix: "",
      isIncome: false,
      isExpense: false,
    });
  });

  it("shows transfer direction when an asset context is provided", () => {
    expect(
      getAmountDisplayConfig("TRANSFER", true, false, 100).amountPrefix,
    ).toBe("+");
    expect(
      getAmountDisplayConfig("TRANSFER", false, true, 100).amountPrefix,
    ).toBe("-");
  });
});
