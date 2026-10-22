import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ManageAssetRightControls from "./ManageAssetRightControls";

describe("ManageAssetRightControls", () => {
  it("formats 0 balance with exactly 2 decimal places as 0.00", () => {
    render(
      <ManageAssetRightControls
        balance={0}
        locale="en-US"
        balanceClass="test-balance"
      />,
    );

    expect(screen.getByText("฿ 0.00")).toBeInTheDocument();
  });

  it("formats positive numbers with 2 decimal places and thousands separators", () => {
    render(
      <ManageAssetRightControls
        balance={1234.5}
        locale="en-US"
        balanceClass="test-balance"
      />,
    );

    expect(screen.getByText("฿ 1,234.50")).toBeInTheDocument();
  });
});
