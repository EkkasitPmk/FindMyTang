import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/features/transactions/services/transactions.server", () => ({
  getTransactionsServer: vi.fn(),
}));
vi.mock("./JournalContainer", () => ({ default: vi.fn() }));

import { cookies } from "next/headers";
import { getTransactionsServer } from "@/features/transactions/services/transactions.server";
import JournalContainer from "./JournalContainer";
import JournalRouteContainer from "./JournalRouteContainer";

const transactions = {
  items: [],
  meta: { page: 1, limit: 30, total: 0, totalPages: 0, nextCursor: null },
};

describe("JournalRouteContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cookies).mockResolvedValue({ has: () => true } as never);
    vi.mocked(getTransactionsServer).mockResolvedValue(transactions as never);
  });

  it("keeps Guests in the client journal mode", async () => {
    vi.mocked(cookies).mockResolvedValue({ has: () => false } as never);

    const page = await JournalRouteContainer();

    expect(page.type).toBe(JournalContainer);
    expect(getTransactionsServer).not.toHaveBeenCalled();
  });

  it("preloads the default cursor timeline for authenticated users", async () => {
    const page = await JournalRouteContainer();

    expect(getTransactionsServer).toHaveBeenCalledWith({
      limit: 30,
      pagination: "cursor",
      isDeleted: false,
      sortType: "DATE_NEWEST",
    });
    expect(page.props.initialTransactions).toBe(transactions);
  });

  it("throws when the authenticated initial read fails", async () => {
    vi.mocked(getTransactionsServer).mockResolvedValue(null);

    await expect(JournalRouteContainer()).rejects.toThrow(
      "Failed to load authenticated journal data",
    );
  });
});
