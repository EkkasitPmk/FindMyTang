import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AssetType, type Asset } from "@/shared/lib/types/asset.type";
import TransactionAssetItem from "./TransactionAssetItem";

const mockAsset: Asset = {
  id: "asset-1",
  name: "My Cash",
  type: AssetType.CASH,
  balance: 1500,
  color: "#10B981",
  isArchived: false,
};

describe("TransactionAssetItem", () => {
  it("renders asset name, formatted balance, and calls onClick", () => {
    const handleClick = vi.fn();
    render(
      <TransactionAssetItem
        asset={mockAsset}
        isSelected={false}
        onClick={handleClick}
      />,
    );

    expect(screen.getByText("My Cash")).toBeInTheDocument();
    expect(screen.getByText("฿1,500.00")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledWith("asset-1");
  });

  it("renders matching icons for different asset types using getAssetIcon", () => {
    const bankAsset: Asset = {
      ...mockAsset,
      id: "asset-bank",
      name: "Bank Account",
      type: AssetType.BANK,
    };

    const { container, rerender } = render(
      <TransactionAssetItem
        asset={bankAsset}
        isSelected={false}
        onClick={vi.fn()}
      />,
    );
    expect(container.querySelector("svg.lucide-landmark")).toBeInTheDocument();

    const cashAsset: Asset = {
      ...mockAsset,
      type: AssetType.CASH,
    };
    rerender(
      <TransactionAssetItem
        asset={cashAsset}
        isSelected={false}
        onClick={vi.fn()}
      />,
    );
    expect(container.querySelector("svg.lucide-banknote")).toBeInTheDocument();

    const cryptoAsset: Asset = {
      ...mockAsset,
      type: AssetType.CRYPTO,
    };
    rerender(
      <TransactionAssetItem
        asset={cryptoAsset}
        isSelected={false}
        onClick={vi.fn()}
      />,
    );
    expect(container.querySelector("svg.lucide-bitcoin")).toBeInTheDocument();
  });

  it("displays long asset name and large balance without truncation classes", () => {
    const longAsset: Asset = {
      ...mockAsset,
      name: "Long Bank Account Name For Emergency Fund",
      balance: 1250000.75,
    };

    render(
      <TransactionAssetItem
        asset={longAsset}
        isSelected={false}
        onClick={vi.fn()}
      />,
    );

    const nameEl = screen.getByText(
      "Long Bank Account Name For Emergency Fund",
    );
    const balanceEl = screen.getByText("฿1,250,000.75");

    expect(nameEl).toHaveClass("whitespace-nowrap");
    expect(nameEl).not.toHaveClass("truncate");
    expect(balanceEl).toHaveClass("whitespace-nowrap");
    expect(balanceEl).not.toHaveClass("truncate");
  });
});

