import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RecurringPageSkeleton, {
  RecurringCardSkeleton,
} from "./RecurringPageSkeleton";

describe("RecurringPageSkeleton", () => {
  it("renders page skeleton with accessible label", () => {
    render(<RecurringPageSkeleton />);
    expect(
      screen.getByLabelText("Loading recurring expenses"),
    ).toBeInTheDocument();
  });

  it("renders single card skeleton with correct layout elements", () => {
    const { container } = render(<RecurringCardSkeleton />);
    expect(container.querySelector(".rounded-2xl")).toBeInTheDocument();
  });
});
