import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));

import { cookies } from "next/headers";
import { getRecurringExpensesServer } from "./recurring.server";

const mockCookies = vi.mocked(cookies);
const mockRecurringExpenses = [
  {
    id: "rec-1",
    name: "Netflix",
    amount: 419,
    currency: "THB",
    billingCycle: "MONTHLY",
    firstBillingDate: "2026-09-22T00:00:00.000Z",
    nextBillingDate: "2026-10-22T00:00:00.000Z",
    status: "ACTIVE",
    deletedAt: null,
  },
];

describe("recurring.server", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("does not read cloud recurring expenses without an access token", async () => {
    mockCookies.mockResolvedValue({ has: () => false } as never);

    await expect(getRecurringExpensesServer(false)).resolves.toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("forwards cookies, uses no-store, and validates the list", async () => {
    mockCookies.mockResolvedValue({
      has: () => true,
      toString: () => "access_token=token",
    } as never);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockRecurringExpenses,
    } as Response);

    await expect(getRecurringExpensesServer(false)).resolves.toMatchObject(
      mockRecurringExpenses,
    );
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/recurring-expenses"),
      expect.objectContaining({
        cache: "no-store",
        headers: { cookie: "access_token=token" },
      }),
    );
  });

  it("returns null for an unavailable authenticated recurring read", async () => {
    mockCookies.mockResolvedValue({
      has: () => true,
      toString: () => "access_token=token",
    } as never);
    vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);

    await expect(getRecurringExpensesServer(false)).resolves.toBeNull();
  });
});
