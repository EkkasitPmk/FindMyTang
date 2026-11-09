import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));

import { cookies } from "next/headers";
import { BACKEND_URL } from "@/shared/lib/configs/backend.config";
import {
  getAvailableDatesServer,
  getRecentTransactionsServer,
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
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("getTransactionsServer", () => {
    it("does not read cloud transactions without an access token", async () => {
      mockCookies.mockResolvedValue({ has: () => false } as never);

      await expect(
        getTransactionsServer({ sortType: "DATE_NEWEST" }),
      ).resolves.toBeNull();
      expect(fetch).not.toHaveBeenCalled();
    });

    it("fetches without query string when query is empty", async () => {
      mockCookies.mockResolvedValue({
        has: () => true,
        toString: () => "access_token=token",
      } as never);
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [],
          meta: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            nextCursor: null,
          },
        }),
      } as Response);

      await expect(getTransactionsServer()).resolves.toMatchObject({
        items: [],
      });
      expect(fetch).toHaveBeenCalledWith(
        `${BACKEND_URL}/api/v1/transactions`,
        expect.any(Object),
      );
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
          meta: {
            page: 1,
            limit: 30,
            total: 1,
            totalPages: 1,
            nextCursor: null,
          },
        }),
      } as Response);

      await expect(
        getTransactionsServer({
          limit: 30,
          pagination: "cursor",
          searchKeyword: undefined,
        }),
      ).resolves.toMatchObject({ items: [transaction] });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("limit=30&pagination=cursor"),
        expect.objectContaining({
          cache: "no-store",
          headers: { cookie: "access_token=token" },
        }),
      );
      expect(vi.mocked(fetch).mock.calls[0][0]).not.toContain("searchKeyword");
    });

    it("returns null when fetch response is not ok", async () => {
      mockCookies.mockResolvedValue({
        has: () => true,
        toString: () => "access_token=token",
      } as never);
      vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);

      await expect(getTransactionsServer()).resolves.toBeNull();
    });

    it("handles fetch exception and logs error", async () => {
      mockCookies.mockResolvedValue({
        has: () => true,
        toString: () => "access_token=token",
      } as never);
      vi.mocked(fetch).mockRejectedValue(new Error("Network fail"));

      await expect(getTransactionsServer()).resolves.toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "Failed to load transactions on the server",
        expect.any(Error),
      );
    });
  });

  describe("getRecentTransactionsServer", () => {
    it("requests 5 transactions sorted by newest date", async () => {
      mockCookies.mockResolvedValue({
        has: () => true,
        toString: () => "access_token=token",
      } as never);
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [transaction],
          meta: {
            page: 1,
            limit: 5,
            total: 1,
            totalPages: 1,
            nextCursor: null,
          },
        }),
      } as Response);

      await expect(getRecentTransactionsServer()).resolves.toMatchObject({
        items: [transaction],
      });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("limit=5&sortType=DATE_NEWEST"),
        expect.any(Object),
      );
    });
  });

  describe("getAvailableDatesServer", () => {
    it("returns null without an access token", async () => {
      mockCookies.mockResolvedValue({ has: () => false } as never);

      await expect(getAvailableDatesServer("asset-1")).resolves.toBeNull();
      expect(fetch).not.toHaveBeenCalled();
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

    it("returns null when response is not ok", async () => {
      mockCookies.mockResolvedValue({
        has: () => true,
        toString: () => "access_token=token",
      } as never);
      vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);

      await expect(getAvailableDatesServer("asset-1")).resolves.toBeNull();
    });

    it("handles fetch exception and logs error", async () => {
      mockCookies.mockResolvedValue({
        has: () => true,
        toString: () => "access_token=token",
      } as never);
      vi.mocked(fetch).mockRejectedValue(new Error("Network fail"));

      await expect(getAvailableDatesServer("asset-1")).resolves.toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "Failed to load available transaction dates on the server",
        expect.any(Error),
      );
    });
  });

  describe("getTransactionServer", () => {
    it("returns null without an access token", async () => {
      mockCookies.mockResolvedValue({ has: () => false } as never);

      await expect(getTransactionServer("transaction-1")).resolves.toBeNull();
      expect(fetch).not.toHaveBeenCalled();
    });

    it("returns null for an unavailable authenticated transaction", async () => {
      mockCookies.mockResolvedValue({
        has: () => true,
        toString: () => "access_token=token",
      } as never);
      vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);

      await expect(getTransactionServer("transaction-1")).resolves.toBeNull();
    });

    it("loads and validates a transaction by id", async () => {
      mockCookies.mockResolvedValue({
        has: () => true,
        toString: () => "access_token=token",
      } as never);
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => transaction,
      } as Response);

      await expect(getTransactionServer("transaction-1")).resolves.toEqual(
        transaction,
      );
      expect(fetch).toHaveBeenCalledWith(
        `${BACKEND_URL}/api/v1/transactions/transaction-1`,
        expect.objectContaining({
          cache: "no-store",
          headers: { cookie: "access_token=token" },
        }),
      );
    });

    it("handles fetch exception and logs error", async () => {
      mockCookies.mockResolvedValue({
        has: () => true,
        toString: () => "access_token=token",
      } as never);
      vi.mocked(fetch).mockRejectedValue(new Error("Network fail"));

      await expect(getTransactionServer("transaction-1")).resolves.toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "Failed to load transaction on the server",
        expect.any(Error),
      );
    });
  });
});
