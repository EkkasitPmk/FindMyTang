import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("../services/recurring.server", () => ({
  getRecurringExpensesServer: vi.fn(),
}));
vi.mock("./RecurringContainer", () => ({ default: vi.fn() }));

import { cookies } from "next/headers";
import { getRecurringExpensesServer } from "../services/recurring.server";
import RecurringContainer from "./RecurringContainer";
import RecurringRouteContainer from "./RecurringRouteContainer";

const mockItems = [
  {
    id: "rec-1",
    name: "Netflix",
    amount: 419,
    billingCycle: "MONTHLY",
    nextBillingDate: "2026-10-22T00:00:00.000Z",
    status: "ACTIVE",
  },
];

describe("RecurringRouteContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cookies).mockResolvedValue({ has: () => true } as never);
    vi.mocked(getRecurringExpensesServer).mockResolvedValue(mockItems as never);
  });

  it("keeps Guests in the Client/Dexie fallback without cloud data", async () => {
    vi.mocked(cookies).mockResolvedValue({ has: () => false } as never);

    const page = await RecurringRouteContainer();

    expect(page.type).toBe(RecurringContainer);
    expect(getRecurringExpensesServer).not.toHaveBeenCalled();
  });

  it("preloads recurring expenses for authenticated users", async () => {
    const page = await RecurringRouteContainer();

    expect(getRecurringExpensesServer).toHaveBeenCalledWith();
    expect(page.props.initialItems).toBe(mockItems);
  });

  it("falls back to client fetching when authenticated initial data is unavailable", async () => {
    vi.mocked(getRecurringExpensesServer).mockResolvedValue(null);

    const page = await RecurringRouteContainer();

    expect(page.props.initialItems).toBeUndefined();
  });
});
