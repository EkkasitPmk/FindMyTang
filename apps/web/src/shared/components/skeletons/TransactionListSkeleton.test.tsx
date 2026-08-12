import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import TransactionListSkeleton from "./TransactionListSkeleton";

describe("TransactionListSkeleton", () => {
  it("renders the shared transaction-group shape used by Recent Journal", () => {
    const markup = renderToStaticMarkup(<TransactionListSkeleton />);

    expect(markup).toContain("size-8 shrink-0 rounded-lg");
    expect(markup).toContain("grid-cols-2 gap-3");
    expect(markup).toContain("h-5 w-20");
  });
});
