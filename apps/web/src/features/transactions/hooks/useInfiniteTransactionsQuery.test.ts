import { describe, expect, it, vi } from "vitest";

const mockUseInfiniteQuery = vi.fn();
vi.mock("@tanstack/react-query", () => ({
  useInfiniteQuery: (...args: unknown[]) => mockUseInfiniteQuery(...args),
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock("@/shared/lib/storages/guest.storage", () => ({
  useGuestStore: (selector: (state: { isGuest: boolean }) => unknown) =>
    selector({ isGuest: false }),
}));

import { useInfiniteTransactionsQuery } from "./transaction.hook";

describe("useInfiniteTransactionsQuery", () => {
  it("defaults gcTime to 0 when maxPages is specified to prevent headless pruned cache", () => {
    mockUseInfiniteQuery.mockClear();
    useInfiniteTransactionsQuery({}, { maxPages: 3 });

    expect(mockUseInfiniteQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        maxPages: 3,
        gcTime: 0,
      }),
    );
  });

  it("respects explicit gcTime override when provided", () => {
    mockUseInfiniteQuery.mockClear();
    useInfiniteTransactionsQuery({}, { maxPages: 3, gcTime: 10_000 });

    expect(mockUseInfiniteQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        maxPages: 3,
        gcTime: 10_000,
      }),
    );
  });

  it("leaves gcTime undefined when maxPages is not specified", () => {
    mockUseInfiniteQuery.mockClear();
    useInfiniteTransactionsQuery({});

    expect(mockUseInfiniteQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        gcTime: undefined,
      }),
    );
  });
});
