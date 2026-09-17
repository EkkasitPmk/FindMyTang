import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const mockUseTransactionsQuery = vi.fn();

vi.mock("@/features/transactions/hooks/transaction.hook", () => ({
  useTransactionsQuery: () => mockUseTransactionsQuery(),
}));
vi.mock("@/features/transactions/containers/TransactionListContainer", () => ({
  TransactionListContainer: () => <div data-testid="tx-list-container" />,
}));
vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    locale: "en-US",
    t: (key: string) => key,
  }),
}));

import RecentJournalContainer from "./RecentJournalContainer";

describe("RecentJournalContainer", () => {
  it("renders skeleton header when query is pending", () => {
    mockUseTransactionsQuery.mockReturnValue({
      data: undefined,
      isPending: true,
    });

    const markup = renderToStaticMarkup(<RecentJournalContainer />);

    // Renders skeleton header
    expect(markup).toContain("h-6 w-32");
    expect(markup).toContain("h-4 w-16");
    // Does not render real text
    expect(markup).not.toContain("recentJournal");
    expect(markup).not.toContain("seeAll");
  });

  it("renders real title and see all link when query resolves", () => {
    mockUseTransactionsQuery.mockReturnValue({
      data: {
        items: [
          {
            id: "tx-1",
            amount: 100,
            transactionDate: "2026-09-18T00:00:00.000Z",
            type: "EXPENSE",
          },
        ],
        total: 1,
      },
      isPending: false,
    });

    const markup = renderToStaticMarkup(<RecentJournalContainer />);

    expect(markup).toContain("recentJournal");
    expect(markup).toContain("seeAll");
  });
});
