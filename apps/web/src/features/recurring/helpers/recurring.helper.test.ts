import { describe, expect, it } from "vitest";
import {
  calculateMonthlyEquivalent,
  calculateRecurringMetrics,
  getNextBillingDate,
  getDueStatus,
  sortRecurringExpenses,
} from "./recurring.helper";
import {
  RecurringCycle,
  RecurringStatus,
  type RecurringExpense,
} from "@/shared/lib/types/recurring.type";

describe("recurring.helper", () => {
  describe("calculateMonthlyEquivalent", () => {
    it("converts monthly amount directly", () => {
      expect(calculateMonthlyEquivalent(419, RecurringCycle.MONTHLY)).toBe(419);
    });

    it("converts yearly amount by dividing by 12", () => {
      expect(calculateMonthlyEquivalent(1200, RecurringCycle.YEARLY)).toBe(100);
    });

    it("converts quarterly amount by dividing by 3", () => {
      expect(calculateMonthlyEquivalent(900, RecurringCycle.QUARTERLY)).toBe(
        300,
      );
    });

    it("converts weekly amount to monthly equivalent", () => {
      // 100 * 52 / 12 = 433.33...
      const result = calculateMonthlyEquivalent(100, RecurringCycle.WEEKLY);
      expect(Math.round(result * 100) / 100).toBe(433.33);
    });

    it("handles zero or negative amount gracefully", () => {
      expect(calculateMonthlyEquivalent(0, RecurringCycle.MONTHLY)).toBe(0);
      expect(calculateMonthlyEquivalent(-50, RecurringCycle.MONTHLY)).toBe(0);
    });
  });

  describe("calculateRecurringMetrics", () => {
    const fixedToday = new Date("2026-10-19T10:00:00.000Z");

    const sampleItems: RecurringExpense[] = [
      {
        id: "1",
        name: "Netflix",
        amount: 419,
        billingCycle: RecurringCycle.MONTHLY,
        firstBillingDate: "2026-09-22T00:00:00.000Z",
        nextBillingDate: "2026-10-22T00:00:00.000Z", // in 3 days
        status: RecurringStatus.ACTIVE,
        createdAt: "2026-09-22T00:00:00.000Z",
        updatedAt: "2026-09-22T00:00:00.000Z",
      },
      {
        id: "2",
        name: "Spotify",
        amount: 209,
        billingCycle: RecurringCycle.MONTHLY,
        firstBillingDate: "2026-09-30T00:00:00.000Z",
        nextBillingDate: "2026-10-31T00:00:00.000Z", // in 12 days
        status: RecurringStatus.ACTIVE,
        createdAt: "2026-09-30T00:00:00.000Z",
        updatedAt: "2026-09-30T00:00:00.000Z",
      },
      {
        id: "3",
        name: "iCloud 2TB",
        amount: 1190,
        billingCycle: RecurringCycle.YEARLY, // 1190 / 12 = 99.166...
        firstBillingDate: "2025-10-24T00:00:00.000Z",
        nextBillingDate: "2026-10-24T00:00:00.000Z", // in 5 days
        status: RecurringStatus.ACTIVE,
        createdAt: "2025-10-24T00:00:00.000Z",
        updatedAt: "2025-10-24T00:00:00.000Z",
      },
      {
        id: "4",
        name: "YouTube Premium (Paused)",
        amount: 159,
        billingCycle: RecurringCycle.MONTHLY,
        firstBillingDate: "2026-01-01T00:00:00.000Z",
        nextBillingDate: "2026-10-20T00:00:00.000Z",
        status: RecurringStatus.PAUSED, // Should be EXCLUDED!
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "5",
        name: "Deleted Service",
        amount: 500,
        billingCycle: RecurringCycle.MONTHLY,
        firstBillingDate: "2026-01-01T00:00:00.000Z",
        nextBillingDate: "2026-10-20T00:00:00.000Z",
        status: RecurringStatus.ACTIVE,
        deletedAt: "2026-05-01T00:00:00.000Z", // Soft deleted -> EXCLUDED!
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ];

    it("excludes PAUSED and deleted items from monthly and yearly calculations", () => {
      const metrics = calculateRecurringMetrics(sampleItems, fixedToday);
      // Active: Netflix (419) + Spotify (209) + iCloud (1190/12 = 99.17) = 727.17
      expect(metrics.totalMonthly).toBe(727.17);
      expect(metrics.totalYearly).toBe(8726);
      expect(metrics.activeCount).toBe(3);
    });

    it("identifies the closest upcoming due item within 7 days", () => {
      const metrics = calculateRecurringMetrics(sampleItems, fixedToday);
      // Netflix is in 3 days, iCloud in 5 days -> Netflix is closest
      expect(metrics.upcomingDueItem?.name).toBe("Netflix");
    });
  });

  describe("getNextBillingDate (Anchor Day Calculation)", () => {
    it("advances monthly cycle preserving the anchor day", () => {
      // Billed on the 15th, paid on the 18th (3 days late)
      const currentBilling = "2026-10-15T00:00:00.000Z";
      const paymentDate = "2026-10-18T00:00:00.000Z";
      const nextDate = getNextBillingDate(
        currentBilling,
        RecurringCycle.MONTHLY,
        paymentDate,
      );

      // Must be 2026-11-15 (NOT Nov 18!)
      expect(nextDate.startsWith("2026-11-15")).toBe(true);
    });

    it("advances yearly cycle preserving month and day", () => {
      const currentBilling = "2026-10-15T00:00:00.000Z";
      const nextDate = getNextBillingDate(
        currentBilling,
        RecurringCycle.YEARLY,
        "2026-10-15T00:00:00.000Z",
      );
      expect(nextDate.startsWith("2027-10-15")).toBe(true);
    });

    it("advances multiple cycles if payment is multiple months late", () => {
      // Due in August 15, but today is October 19 (missed Aug, Sep, Oct)
      const missedBilling = "2026-08-15T00:00:00.000Z";
      const today = "2026-10-19T00:00:00.000Z";
      const nextDate = getNextBillingDate(
        missedBilling,
        RecurringCycle.MONTHLY,
        today,
      );

      // Must roll forward past today to Nov 15!
      expect(nextDate.startsWith("2026-11-15")).toBe(true);
    });
  });

  describe("getDueStatus", () => {
    const today = new Date("2026-10-19T10:00:00.000Z");

    it.each([
      {
        scenario: "overdue",
        billingDate: "2026-10-15T00:00:00.000Z",
        expectedOverdue: true,
        expectedLabel: "เลยกำหนด 4 วัน",
      },
      {
        scenario: "due today",
        billingDate: "2026-10-19T00:00:00.000Z",
        expectedOverdue: false,
        expectedLabel: "ตัดรอบวันนี้",
      },
      {
        scenario: "due tomorrow",
        billingDate: "2026-10-20T00:00:00.000Z",
        expectedOverdue: false,
        expectedLabel: "ตัดรอบพรุ่งนี้",
      },
      {
        scenario: "upcoming in N days",
        billingDate: "2026-10-22T00:00:00.000Z",
        expectedOverdue: false,
        expectedLabel: "ตัดรอบในอีก 3 วัน",
      },
    ])(
      "detects $scenario correctly",
      ({ billingDate, expectedOverdue, expectedLabel }) => {
        const status = getDueStatus(billingDate, today);
        expect(status.isOverdue).toBe(expectedOverdue);
        expect(status.label).toBe(expectedLabel);
      },
    );
  });

  describe("sortRecurringExpenses", () => {
    it("sorts by nextBillingDate ascending (soonest first)", () => {
      const items: RecurringExpense[] = [
        {
          id: "1",
          name: "Later",
          amount: 100,
          billingCycle: RecurringCycle.MONTHLY,
          firstBillingDate: "2026-10-01",
          nextBillingDate: "2026-11-20T00:00:00.000Z",
          status: RecurringStatus.ACTIVE,
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "2",
          name: "Soonest",
          amount: 200,
          billingCycle: RecurringCycle.MONTHLY,
          firstBillingDate: "2026-10-01",
          nextBillingDate: "2026-10-22T00:00:00.000Z",
          status: RecurringStatus.ACTIVE,
          createdAt: "",
          updatedAt: "",
        },
      ];

      const sorted = sortRecurringExpenses(items);
      expect(sorted[0].name).toBe("Soonest");
      expect(sorted[1].name).toBe("Later");
    });
  });
});
