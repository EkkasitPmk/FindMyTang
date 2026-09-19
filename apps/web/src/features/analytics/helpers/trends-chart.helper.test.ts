import { describe, expect, it } from "vitest";
import {
  calculatePackedBarLayout,
  calculateTrendsAxisScale,
  ALL_SERIES,
  SERIES_ORDER,
} from "./trends-chart.helper";

describe("trends-chart.helper", () => {
  it("maintains the required series order: Expense -> Income -> Transfer -> Adjustment", () => {
    expect(ALL_SERIES).toEqual(["expense", "income", "transfer", "adjust"]);
    expect(SERIES_ORDER.expense).toBeLessThan(SERIES_ORDER.income);
    expect(SERIES_ORDER.income).toBeLessThan(SERIES_ORDER.transfer);
    expect(SERIES_ORDER.transfer).toBeLessThan(SERIES_ORDER.adjust);
  });

  it("returns null when width is invalid or payload is missing", () => {
    expect(
      calculatePackedBarLayout({
        x: 10,
        width: 0,
        currentKey: "expense",
        chartActiveSeries: [...ALL_SERIES],
        numActiveSeries: 4,
        payload: { expense: 100 },
      }),
    ).toBeNull();

    expect(
      calculatePackedBarLayout({
        x: 10,
        width: 20,
        currentKey: "expense",
        chartActiveSeries: [...ALL_SERIES],
        numActiveSeries: 4,
        payload: undefined,
      }),
    ).toBeNull();
  });

  it("returns null when current key is 0 in that month", () => {
    const layout = calculatePackedBarLayout({
      x: 10,
      width: 20,
      currentKey: "adjust",
      chartActiveSeries: [...ALL_SERIES],
      numActiveSeries: 4,
      payload: { expense: 100, income: 200, transfer: 50, adjust: 0 },
    });

    expect(layout).toBeNull();
  });

  it("packs negative values (e.g. negative adjustments) properly", () => {
    const layout = calculatePackedBarLayout({
      x: 10,
      width: 20,
      currentKey: "adjust",
      chartActiveSeries: [...ALL_SERIES],
      numActiveSeries: 4,
      payload: { expense: 100, income: 200, transfer: 50, adjust: -75 },
    });

    expect(layout).not.toBeNull();
  });

  it("dynamically packs bars and expands width when some series have 0 value", () => {
    const expenseLayout = calculatePackedBarLayout({
      x: 10,
      width: 20,
      currentKey: "expense",
      chartActiveSeries: [...ALL_SERIES],
      numActiveSeries: 4,
      payload: { expense: 100, income: 200, transfer: 0, adjust: 0 },
      barGap: 2,
    });

    const incomeLayout = calculatePackedBarLayout({
      x: 32,
      width: 20,
      currentKey: "income",
      chartActiveSeries: [...ALL_SERIES],
      numActiveSeries: 4,
      payload: { expense: 100, income: 200, transfer: 0, adjust: 0 },
      barGap: 2,
    });

    expect(expenseLayout).not.toBeNull();
    expect(incomeLayout).not.toBeNull();
    expect(expenseLayout?.dynamicBarWidth).toBe(42);
    expect(incomeLayout?.dynamicBarWidth).toBe(42);
    expect(expenseLayout?.newX).toBe(10);
    expect(incomeLayout?.newX).toBe(10 + 42 + 2);
  });

  describe("calculateTrendsAxisScale", () => {
    it("returns positive ticks starting at 0 when there are no negative values", () => {
      const scale = calculateTrendsAxisScale(0, 20000);
      expect(scale.ticks[0]).toBe(0);
      expect(scale.domain[0]).toBe(0);
      expect(scale.domain[1]).toBe(scale.ticks.at(-1));
      expect(scale.ticks.at(-1)).toBeGreaterThanOrEqual(20000);
    });

    it("handles zero data gracefully with clean non-fractional ticks", () => {
      const scale = calculateTrendsAxisScale(0, 0);
      expect(scale.ticks[0]).toBe(0);
      expect(scale.domain).toEqual([0, 100]);
      expect(scale.ticks).toEqual([0, 25, 50, 75, 100]);
    });

    it("keeps bottom tick at 0 and adds tight negative domain padding when negative value is small", () => {
      const scale = calculateTrendsAxisScale(-75, 22042);
      // Crucial check: Bottom tick must be 0 (no bloated -7.5k tick)
      expect(scale.ticks[0]).toBe(0);
      expect(scale.ticks.every((t) => t >= 0)).toBe(true);
      // Domain extends slightly negative to allow the -75 bar to draw downward
      expect(scale.domain[0]).toBeLessThan(0);
      expect(scale.domain[0]).toBeGreaterThanOrEqual(-1000);
      expect(scale.domain[1]).toBe(scale.ticks.at(-1));
    });

    it("includes negative ticks when negative value is large", () => {
      const scale = calculateTrendsAxisScale(-10000, 20000);
      expect(scale.ticks[0]).toBeLessThan(0);
      expect(scale.ticks).toContain(0);
      expect(scale.domain[0]).toBe(scale.ticks[0]);
      expect(scale.domain[1]).toBe(scale.ticks.at(-1));
    });

    it("scales properly when only negative values exist", () => {
      const scale = calculateTrendsAxisScale(-75, 0);
      expect(scale.ticks.at(-1)).toBe(0);
      expect(scale.ticks[0]).toBeLessThanOrEqual(-75);
      expect(scale.ticks[0]).toBeGreaterThanOrEqual(-100);
      expect(scale.domain[0]).toBe(scale.ticks[0]);
      expect(scale.domain[1]).toBe(0);
    });
  });
});
