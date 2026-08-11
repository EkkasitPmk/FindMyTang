import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/features/assets/services/assets.server", () => ({
  getAssetsServer: vi.fn(),
}));
vi.mock("@/features/category/services/category.server", () => ({
  getCategoriesServer: vi.fn(),
}));
vi.mock("../services/transactions.server", () => ({
  getTransactionServer: vi.fn(),
}));
vi.mock("../components/TransactionMobileGuard", () => ({ default: vi.fn() }));

import { cookies } from "next/headers";
import { getAssetsServer } from "@/features/assets/services/assets.server";
import { getCategoriesServer } from "@/features/category/services/category.server";
import { getTransactionServer } from "../services/transactions.server";
import TransactionMobileGuard from "../components/TransactionMobileGuard";
import TransactionsRouteContainer from "./TransactionsRouteContainer";

const assets = [{ id: "asset-1", name: "Cash", type: "CASH", balance: 100 }];
const categories = [{ id: "category-1", name: "Food", type: "EXPENSE" }];
const transaction = {
  id: "transaction-1",
  type: "EXPENSE",
  amount: 25,
  transactionDate: "2026-08-12T00:00:00.000Z",
  assetId: "asset-1",
};

describe("TransactionsRouteContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cookies).mockResolvedValue({ has: () => true } as never);
    vi.mocked(getAssetsServer).mockResolvedValue(assets as never);
    vi.mocked(getCategoriesServer).mockResolvedValue(categories as never);
    vi.mocked(getTransactionServer).mockResolvedValue(transaction as never);
  });

  it("keeps Guests in the browser fallback without cloud reads", async () => {
    vi.mocked(cookies).mockResolvedValue({ has: () => false } as never);

    const page = await TransactionsRouteContainer({});

    expect(page.type).toBe(TransactionMobileGuard);
    expect(getAssetsServer).not.toHaveBeenCalled();
    expect(getCategoriesServer).not.toHaveBeenCalled();
  });

  it("loads form selections and the edited transaction on the server", async () => {
    const page = await TransactionsRouteContainer({
      transactionId: "transaction-1",
    });

    expect(getAssetsServer).toHaveBeenCalledWith();
    expect(getCategoriesServer).toHaveBeenCalledWith(false);
    expect(getTransactionServer).toHaveBeenCalledWith("transaction-1");
    expect(page.props.initialTransaction).toBe(transaction);
  });

  it("throws when an authenticated initial read fails", async () => {
    vi.mocked(getAssetsServer).mockResolvedValue(null);

    await expect(TransactionsRouteContainer({})).rejects.toThrow(
      "Failed to load authenticated transaction data",
    );
  });
});
