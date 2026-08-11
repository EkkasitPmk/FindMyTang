import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));

import { cookies } from "next/headers";
import {
  getAvailableDatesServer,
  getTransactionServer,
  getTransactionsServer,
} from "./transactions.server";

const mockCookies = vi.mocked(cookies);
const transaction = {
  id: "transaction-1",
  type: "EXPENSE",
  amount: 25,
  transactionDate: "2026-08-12T00:00:00.000Z",
  assetId: "asset-1",
};

describe("transactions.server", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("does not read cloud transactions without an access token", async () => {
    mockCookies.mockResolvedValue({ has: () => false } as never);

    await expect(
      getTransactionsServer({ sortType: "DATE_NEWEST" }),
    ).resolves.toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("forwards request cookies and validates the transaction list", async () => {
    mockCookies.mockResolvedValue({
      has: () => true,
      toString: () => "access_token=token",
    } as never);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [transaction],
        meta: { page: 1, limit: 30, total: 1, totalPages: 1, nextCursor: null },
      }),
    } as Response);

    await expect(
      getTransactionsServer({ limit: 30, pagination: "cursor" }),
    ).resolves.toMatchObject({ items: [transaction] });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("limit=30&pagination=cursor"),
      expect.objectContaining({
        cache: "no-store",
        headers: { cookie: "access_token=token" },
      }),
    );
  });

  it("returns null for an unavailable authenticated transaction", async () => {
    mockCookies.mockResolvedValue({
      has: () => true,
      toString: () => "access_token=token",
    } as never);
    vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);

    await expect(getTransactionServer("transaction-1")).resolves.toBeNull();
  });

  it("loads and validates an asset's available transaction dates", async () => {
    mockCookies.mockResolvedValue({
      has: () => true,
      toString: () => "access_token=token",
    } as never);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ "2026": ["August"] }),
    } as Response);

    await expect(getAvailableDatesServer("asset-1")).resolves.toEqual({
      "2026": ["August"],
    });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        "/transactions/available-dates?assetId=asset-1&isDeleted=false",
      ),
      expect.objectContaining({
        cache: "no-store",
        headers: { cookie: "access_token=token" },
      }),
    );
  });
});
