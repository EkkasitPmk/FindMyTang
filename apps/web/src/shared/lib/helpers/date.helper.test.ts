import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getDiffDays, formatDisplayDate } from "./date.helper";

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
  });
});
