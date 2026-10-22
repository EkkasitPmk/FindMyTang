import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RecurringSummaryCard from "./RecurringSummaryCard";

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    locale: "en-US",
    t: (key: string) => {
      const map: Record<string, string> = {
        recurringSummaryTitle: "Recurring Cost Summary",
        recurringSummarySubtitle: "Normalized from all active billing cycles",
        recurringTotalMonthly: "Total Monthly Cost",
        recurringTotalYearly: "Total Yearly Cost",
        recurringDailyAverage: "Daily Average",
        recurringPerMonth: "/ month",
        recurringPerYear: "/ year",
        recurringPerDay: "/ day",
        recurringActiveCount: "{count} active",
      };
      return map[key] || key;
    },
  }),
}));

describe("RecurringSummaryCard", () => {
  it("renders monthly total, yearly total, daily average, and active count correctly", () => {
    render(
      <RecurringSummaryCard
        metrics={{
          totalMonthly: 1489,
          totalYearly: 17868,
          activeCount: 6,
          upcomingDueItem: null,
        }}
      />,
    );

    expect(screen.getByText("Recurring Cost Summary")).toBeInTheDocument();
    expect(
      screen.getByText("Normalized from all active billing cycles"),
    ).toBeInTheDocument();
    expect(screen.getByText("Total Monthly Cost")).toBeInTheDocument();
    expect(screen.getByText("฿1,489.00")).toBeInTheDocument();
    expect(screen.getByText("/ month")).toBeInTheDocument();
    expect(screen.getByText("Total Yearly Cost")).toBeInTheDocument();
    expect(screen.getByText("฿17,868.00")).toBeInTheDocument();
    expect(screen.getByText("/ year")).toBeInTheDocument();
    expect(screen.getByText("Daily Average")).toBeInTheDocument();
    expect(screen.getByText("฿49.63")).toBeInTheDocument();
    expect(screen.getByText("/ day")).toBeInTheDocument();
    expect(screen.getByText("6 active")).toBeInTheDocument();
  });

  it("handles zero active count gracefully without dividing by zero error", () => {
    render(
      <RecurringSummaryCard
        metrics={{
          totalMonthly: 0,
          totalYearly: 0,
          activeCount: 0,
          upcomingDueItem: null,
        }}
      />,
    );

    expect(screen.getAllByText("฿0.00").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("0 active")).toBeInTheDocument();
  });
});
