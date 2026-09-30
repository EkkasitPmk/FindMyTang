import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getDiffDays,
  formatDisplayDate,
  getCurrentPeriod,
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

    it("formats weeks correctly (e.g. In 1 week)", () => {
      const result = formatDisplayDate(new Date("2026-07-15T12:00:00Z"));
      expect(result).toMatch(/^In 1 week, /);
    });

    it("formats days ago correctly (e.g. 2 days ago)", () => {
      const result = formatDisplayDate(new Date("2026-07-06T12:00:00Z"));
      expect(result).toMatch(/^2 days ago, /);
    });

    it("includes time when includeTime is true", () => {
      // The exact time format might depend on the runner's timezone,
      // but since we mocked the system time and en-US locale is used,
      // it should be formatted appropriately.
      const d = new Date("2026-07-08T15:30:00Z"); // Using 15:30 UTC
      const result = formatDisplayDate(d, true);
      // It should end with something like "15:30" or "X:30" depending on timezone,
      // let's just check that it contains a colon and 2 digits for minutes.
      expect(result).toMatch(/\d{2}:\d{2}$/);
    });
  });

  describe("getCurrentPeriod", () => {
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
