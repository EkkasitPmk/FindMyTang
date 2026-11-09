import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getDiffDays,
  formatDisplayDate,
  getCurrentPeriod,
  updatePresetDate,
} from "./date.helper";

describe("date.helper", () => {
  beforeEach(() => {
    // Mock the current date to a fixed date for reliable testing: 2026-07-08
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-08T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getDiffDays", () => {
    it("returns null if date is undefined", () => {
      expect(getDiffDays(undefined)).toBeNull();
    });

    it("returns 0 for today", () => {
      expect(getDiffDays(new Date("2026-07-08T15:00:00Z"))).toBe(0);
    });

    it("returns 1 for tomorrow", () => {
      expect(getDiffDays(new Date("2026-07-09T10:00:00Z"))).toBe(1);
    });

    it("returns -1 for yesterday", () => {
      expect(getDiffDays(new Date("2026-07-07T10:00:00Z"))).toBe(-1);
    });
  });

  describe("formatDisplayDate", () => {
    it("returns empty string if date is undefined", () => {
      expect(formatDisplayDate(undefined)).toBe("");
    });

    it("formats today correctly", () => {
      const result = formatDisplayDate(new Date("2026-07-08T12:00:00Z"));
      expect(result).toMatch(/^Today, /);
    });

    it("formats tomorrow correctly", () => {
      const result = formatDisplayDate(new Date("2026-07-09T12:00:00Z"));
      expect(result).toMatch(/^Tomorrow, /);
    });

    it("formats yesterday correctly", () => {
      const result = formatDisplayDate(new Date("2026-07-07T12:00:00Z"));
      expect(result).toMatch(/^Yesterday, /);
    });

    it("formats weeks correctly (e.g. In 1 week and multiple weeks)", () => {
      const inOneWeek = formatDisplayDate(new Date("2026-07-15T12:00:00Z"));
      expect(inOneWeek).toMatch(/^In 1 week, /);

      const inTwoWeeks = formatDisplayDate(new Date("2026-07-22T12:00:00Z"));
      expect(inTwoWeeks).toMatch(/^In 2 weeks, /);

      const twoWeeksAgo = formatDisplayDate(new Date("2026-06-24T12:00:00Z"));
      expect(twoWeeksAgo).toMatch(/^2 weeks ago, /);
    });

    it("formats days correctly", () => {
      const inThreeDays = formatDisplayDate(new Date("2026-07-11T12:00:00Z"));
      expect(inThreeDays).toMatch(/^In 3 days, /);

      const twoDaysAgo = formatDisplayDate(new Date("2026-07-06T12:00:00Z"));
      expect(twoDaysAgo).toMatch(/^2 days ago, /);
    });

    it("uses translation function t when provided", () => {
      const mockT = vi.fn((key: string) => {
        if (key === "today") return "วันนี้";
        if (key === "inWeeks") return "ในอีก {weeks} สัปดาห์";
        if (key === "weeksAgo") return "{weeks} สัปดาห์ที่แล้ว";
        if (key === "inDays") return "ในอีก {days} วัน";
        if (key === "daysAgo") return "{days} วันที่แล้ว";
        return key;
      });

      // exact day
      expect(
        formatDisplayDate(
          new Date("2026-07-08T12:00:00Z"),
          false,
          "th-TH",
          mockT,
        ),
      ).toMatch(/^วันนี้, /);
      // weeks in future
      expect(
        formatDisplayDate(
          new Date("2026-07-22T12:00:00Z"),
          false,
          "th-TH",
          mockT,
        ),
      ).toMatch(/^ในอีก 2 สัปดาห์, /);
      // weeks in past
      expect(
        formatDisplayDate(
          new Date("2026-06-24T12:00:00Z"),
          false,
          "th-TH",
          mockT,
        ),
      ).toMatch(/^2 สัปดาห์ที่แล้ว, /);
      // days in future
      expect(
        formatDisplayDate(
          new Date("2026-07-11T12:00:00Z"),
          false,
          "th-TH",
          mockT,
        ),
      ).toMatch(/^ในอีก 3 วัน, /);
      // days in past
      expect(
        formatDisplayDate(
          new Date("2026-07-05T12:00:00Z"),
          false,
          "th-TH",
          mockT,
        ),
      ).toMatch(/^3 วันที่แล้ว, /);
    });

    it("formats without prefix when translation returns empty string", () => {
      const result = formatDisplayDate(
        new Date("2026-07-08T12:00:00Z"),
        false,
        "en-US",
        () => "",
      );
      expect(result).toBe("08 Jul 26");
    });

    it("formats year using Buddhist calendar for th-TH locale", () => {
      const d = new Date("2026-07-08T12:00:00Z");
      // 2026 + 543 = 2569 -> slice(-2) -> "69"
      const result = formatDisplayDate(d, false, "th-TH");
      expect(result).toContain("69");
    });

    it("includes time when includeTime is true", () => {
      const d = new Date("2026-07-08T15:30:00Z");
      const result = formatDisplayDate(d, true);
      expect(result).toMatch(/\d{2}:\d{2}$/);
    });
  });

  describe("updatePresetDate", () => {
    it("adds days to current date without baseDate", () => {
      const result = updatePresetDate(3);
      expect(result.getDate()).toBe(11);
      expect(result.getMonth()).toBe(6); // July is index 6
    });

    it("adds days and copies hours/minutes from baseDate", () => {
      const base = new Date("2026-01-01T08:45:12Z");
      const result = updatePresetDate(-2, base);
      expect(result.getDate()).toBe(6);
      expect(result.getHours()).toBe(base.getHours());
      expect(result.getMinutes()).toBe(base.getMinutes());
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  describe("getCurrentPeriod", () => {
    it("returns correct default period without arguments", () => {
      const period = getCurrentPeriod();
      expect(period).toEqual({ month: 7, year: 2026 });
    });

    it("returns correct month and year for Bangkok timezone across UTC boundary", () => {
      // 2026-09-30 19:30 UTC is 2026-10-01 02:30 in Asia/Bangkok
      const utcDate = new Date("2026-09-30T19:30:00Z");
      const period = getCurrentPeriod(utcDate, "Asia/Bangkok");
      expect(period).toEqual({ month: 10, year: 2026 });
    });

    it("returns correct year rollover across new year boundary", () => {
      // 2026-12-31 20:00 UTC is 2027-01-01 03:00 in Asia/Bangkok
      const newYearEve = new Date("2026-12-31T20:00:00Z");
      const period = getCurrentPeriod(newYearEve, "Asia/Bangkok");
      expect(period).toEqual({ month: 1, year: 2027 });
    });
  });
});
