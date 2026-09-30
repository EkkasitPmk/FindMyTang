import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DrilldownTransactionList } from "./DrilldownTransactionList";

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    currentLanguage: "en",
    locale: "en-US",
  }),
}));

import { AssetType } from "@/shared/lib/types/asset.type";

const mockCategory = {
  id: "cat-1",
  name: "Grab Rider",
  color: "#00B14F",
  icon: "bike",
};

const mockAssets = [
  {
    id: "asset-1",
    name: "KBank",
    type: AssetType.BANK,
    balance: 1000,
    color: "#16a34a",
    isArchived: false,
    displayOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "asset-2",
    name: "เงินสด",
    type: AssetType.CASH,
    balance: 500,
    color: "#3B82F6",
    isArchived: false,
    displayOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

describe("DrilldownTransactionList", () => {
  it("renders transaction list grouped by local date and displays time", () => {
    // 2026-09-17 14:30:00 local time
    const txDate = new Date(2026, 8, 17, 14, 30, 0);

    const transactions = [
      {
        id: "tx-1",
        amount: 150,
        date: txDate.toISOString(),
        type: "EXPENSE" as const,
        note: "Delivery Fee",
        asset: { id: "asset-1", name: "KBank", type: "BANK" as const },
      },
    ];

    render(
      <DrilldownTransactionList
        transactions={transactions}
        category={mockCategory}
        assets={mockAssets}
      />,
    );

    // Group header should show Sep 17, 2026
    expect(screen.getByText("Sep 17, 2026")).toBeDefined();
    expect(screen.getByText("Delivery Fee")).toBeDefined();
    expect(screen.getByText("KBank")).toBeDefined();
    expect(screen.getByText("14:30")).toBeDefined();
  });

  it("formats negative adjustments with single minus sign and positive with plus sign", () => {
    const transactions = [
      {
        id: "tx-adj-neg",
        amount: -79,
        date: new Date(2026, 8, 30, 10, 0, 0).toISOString(),
        type: "ADJUSTMENT" as const,
        note: "Balance correction down",
        asset: { id: "asset-1", name: "KBank", type: "BANK" as const },
      },
      {
        id: "tx-adj-pos",
        amount: 50,
        date: new Date(2026, 8, 30, 11, 0, 0).toISOString(),
        type: "ADJUSTMENT" as const,
        note: "Balance correction up",
        asset: { id: "asset-1", name: "KBank", type: "BANK" as const },
      },
    ];

    render(
      <DrilldownTransactionList
        transactions={transactions}
        category={mockCategory}
        assets={mockAssets}
      />,
    );

    // Negative adjustment should NOT have double minus sign '--'
    expect(screen.queryByText(/--/)).toBeNull();
    expect(screen.getByText("-฿79")).toBeDefined();
    expect(screen.getByText("+฿50")).toBeDefined();
  });

  it("shows empty state when no transactions exist", () => {
    render(
      <DrilldownTransactionList transactions={[]} category={mockCategory} />,
    );

    expect(screen.getByText("noTransactionsThisMonth")).toBeDefined();
  });

  it("renders transfer transactions with source asset -> target asset flow", () => {
    const transactions = [
      {
        id: "tx-transfer",
        amount: 100,
        date: new Date(2026, 8, 30, 16, 45, 0).toISOString(),
        type: "TRANSFER" as const,
        note: "ถอนเงินสด",
        asset: { id: "asset-1", name: "KBank", type: "BANK" as const },
        toAsset: { id: "asset-2", name: "เงินสด", type: "CASH" as const },
      },
    ];

    render(
      <DrilldownTransactionList
        transactions={transactions}
        category={{
          id: "uncategorized_transfer",
          name: "Transfer",
          color: "#3B82F6",
          icon: null,
        }}
        assets={mockAssets}
      />,
    );

    expect(screen.getByText("KBank")).toBeDefined();
    expect(screen.getByText("เงินสด")).toBeDefined();
    expect(screen.getByText("→")).toBeDefined();
    expect(screen.getByText("16:45")).toBeDefined();
    expect(screen.getByText("฿100")).toBeDefined();
    expect(screen.queryByText("-฿100")).toBeNull();
  });
});
