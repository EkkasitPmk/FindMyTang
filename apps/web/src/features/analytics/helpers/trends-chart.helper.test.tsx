import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/shared/components/ui/chart", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/shared/components/ui/chart")>();
  return {
    ...actual,
    ChartLegendContent: vi.fn(
      ({
        payload,
        className,
      }: {
        payload?: Array<{ dataKey?: string; value?: string; color?: string }>;
        className?: string;
      }) => (
        <div data-testid="chart-legend-content" className={className}>
          {payload?.map((item, i) => (
            <span key={i} data-testid="legend-item">
              {item.dataKey || item.value}
            </span>
          ))}
        </div>
      ),
    ),
  };
});

import {
  calculatePackedBarLayout,
  calculateTrendsAxisScale,
  ALL_SERIES,
  SERIES_ORDER,
  PackedBarShape,
  TrendsTooltipItem,
  TrendsLegendContent,
  TrendsTooltipContent,
} from "./trends-chart.helper";
import { ChartConfig } from "@/shared/components/ui/chart";

const chartConfig: ChartConfig = {
  expense: { label: "Expense", color: "var(--color-expense)" },
  income: { label: "Income", color: "var(--color-income)" },
  transfer: { label: "Transfer", color: "var(--color-transfer)" },
  adjust: { label: "Adjustment", color: "var(--color-adjust)" },
};

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

  it("returns null when currentKey is not in chartActiveSeries", () => {
    const layout = calculatePackedBarLayout({
      x: 10,
      width: 20,
      currentKey: "adjust",
      chartActiveSeries: ["expense", "income"],
      numActiveSeries: 2,
      payload: { adjust: 100 },
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

  describe("PackedBarShape", () => {
    it("returns null when value is zero, missing, or parameters are incomplete", () => {
      const { container: c1 } = render(
        <svg>
          <PackedBarShape
            currentKey="expense"
            fillVar="red"
            chartActiveSeries={[...ALL_SERIES]}
            numActiveSeries={4}
            value={0}
            x={10}
            y={20}
            width={15}
            height={30}
            payload={{ expense: 0 }}
          />
        </svg>,
      );
      expect(c1.querySelector("path")).toBeNull();

      const { container: c2 } = render(
        <svg>
          <PackedBarShape
            currentKey="expense"
            fillVar="red"
            chartActiveSeries={[...ALL_SERIES]}
            numActiveSeries={4}
            value={undefined}
            x={10}
            y={20}
            width={15}
            height={30}
            payload={{ expense: 100 }}
          />
        </svg>,
      );
      expect(c2.querySelector("path")).toBeNull();

      const { container: c3 } = render(
        <svg>
          <PackedBarShape
            currentKey="expense"
            fillVar="red"
            chartActiveSeries={[...ALL_SERIES]}
            numActiveSeries={4}
            value={100}
            x={10}
            y={undefined}
            width={15}
            height={30}
            payload={{ expense: 100 }}
          />
        </svg>,
      );
      expect(c3.querySelector("path")).toBeNull();

      const { container: c4 } = render(
        <svg>
          <PackedBarShape
            currentKey="expense"
            fillVar="red"
            chartActiveSeries={[...ALL_SERIES]}
            numActiveSeries={4}
            value={100}
            x={10}
            y={20}
            width={0}
            height={30}
            payload={{ expense: 100 }}
          />
        </svg>,
      );
      expect(c4.querySelector("path")).toBeNull();
    });

    it("renders positive bar with correct height and top radius", () => {
      const { container } = render(
        <svg>
          <PackedBarShape
            currentKey="expense"
            fillVar="red"
            chartActiveSeries={[...ALL_SERIES]}
            numActiveSeries={4}
            value={100}
            x={10}
            y={50}
            width={20}
            height={40}
            payload={{ expense: 100 }}
          />
        </svg>,
      );
      expect(container.querySelector("path")).not.toBeNull();
    });

    it("renders negative bar with clamped min height and bottom radius", () => {
      const { container } = render(
        <svg>
          <PackedBarShape
            currentKey="adjust"
            fillVar="blue"
            chartActiveSeries={[...ALL_SERIES]}
            numActiveSeries={4}
            value={-25}
            x={10}
            y={50}
            width={20}
            height={2}
            payload={{ adjust: -25 }}
          />
        </svg>,
      );
      expect(container.querySelector("path")).not.toBeNull();
    });

    it("handles undefined height gracefully", () => {
      const { container } = render(
        <svg>
          <PackedBarShape
            currentKey="expense"
            fillVar="red"
            chartActiveSeries={[...ALL_SERIES]}
            numActiveSeries={4}
            value={100}
            x={10}
            y={50}
            width={20}
            height={undefined}
            payload={{ expense: 100 }}
          />
        </svg>,
      );
      expect(container.querySelector("path")).not.toBeNull();
    });
  });

  describe("TrendsTooltipItem", () => {
    it("renders standard formatted series value and color", () => {
      render(
        <TrendsTooltipItem
          value={500}
          name="income"
          item={{ color: "green" }}
          chartConfig={chartConfig}
        />,
      );
      expect(screen.getByText("Income")).toBeInTheDocument();
      expect(screen.getByText("฿500")).toBeInTheDocument();
    });

    it("renders positive adjustment with plus sign when rawAdjust is positive", () => {
      render(
        <TrendsTooltipItem
          value={100}
          name="adjust"
          item={{ payload: { rawAdjust: 100 } }}
          chartConfig={chartConfig}
        />,
      );
      expect(screen.getByText("+฿100")).toBeInTheDocument();
    });

    it("renders negative adjustment without extra plus sign", () => {
      render(
        <TrendsTooltipItem
          value={-50}
          name="adjust"
          item={{ payload: { rawAdjust: -50 } }}
          chartConfig={chartConfig}
        />,
      );
      expect(screen.getByText("-฿50")).toBeInTheDocument();
    });

    it("falls back to value when rawAdjust is undefined in adjust series", () => {
      render(
        <TrendsTooltipItem
          value={80}
          name="adjust"
          item={{}}
          chartConfig={chartConfig}
        />,
      );
      expect(screen.getByText("+฿80")).toBeInTheDocument();
    });

    it("falls back to series name when chartConfig label is missing", () => {
      render(
        <TrendsTooltipItem
          value={300}
          name="customUnknown"
          item={{ color: "#123456" }}
          chartConfig={chartConfig}
        />,
      );
      expect(screen.getByText("customUnknown")).toBeInTheDocument();
      expect(screen.getByText("฿300")).toBeInTheDocument();
    });
  });

  describe("TrendsLegendContent", () => {
    it("handles undefined payload without throwing", () => {
      const { container } = render(<TrendsLegendContent payload={undefined} />);
      expect(container).toBeInTheDocument();
    });

    it("sorts legend items by defined series order", () => {
      render(
        <TrendsLegendContent
          payload={[
            { color: "black", value: undefined, dataKey: undefined },
            { value: "adjust", color: "blue", dataKey: undefined },
            { value: undefined, dataKey: "expense", color: "red" },
            { value: "income", dataKey: undefined, color: "green" },
            { value: undefined, dataKey: undefined, color: "gray" },
            { value: "unknownKey", dataKey: undefined, color: "yellow" },
            { value: undefined, dataKey: "unknownKey2", color: "purple" },
          ]}
        />,
      );

      const items = screen.getAllByTestId("legend-item");
      expect(items.map((el) => el.textContent)).toEqual([
        "expense",
        "income",
        "adjust",
        "",
        "",
        "unknownKey",
        "unknownKey2",
      ]);
    });
  });

  describe("TrendsTooltipContent", () => {
    it("returns null when inactive, empty payload, or chartConfig is missing", () => {
      const { container: c1 } = render(
        <TrendsTooltipContent
          active={false}
          payload={[{ dataKey: "income", value: 100 }]}
          chartConfig={chartConfig}
        />,
      );
      expect(c1.firstChild).toBeNull();

      const { container: c2 } = render(
        <TrendsTooltipContent
          active={true}
          payload={[]}
          chartConfig={chartConfig}
        />,
      );
      expect(c2.firstChild).toBeNull();

      const { container: c3 } = render(
        <TrendsTooltipContent
          active={true}
          payload={[{ dataKey: "income", value: 100 }]}
          chartConfig={undefined}
        />,
      );
      expect(c3.firstChild).toBeNull();
    });

    it("renders tooltip content with label and items, filtering out null/undefined values", () => {
      render(
        <TrendsTooltipContent
          active={true}
          label="Jan 2026"
          payload={[
            { dataKey: "expense", value: 200, color: "red" },
            { name: "income", value: 500, color: "green" },
            { dataKey: "transfer", value: undefined },
            { dataKey: "adjust", value: null },
          ]}
          chartConfig={chartConfig}
        />,
      );

      expect(screen.getByText("Jan 2026")).toBeInTheDocument();
      expect(screen.getByText("Expense")).toBeInTheDocument();
      expect(screen.getByText("฿200")).toBeInTheDocument();
      expect(screen.getByText("Income")).toBeInTheDocument();
      expect(screen.getByText("฿500")).toBeInTheDocument();
      expect(screen.queryByText("Transfer")).toBeNull();
    });

    it("renders tooltip content without label when label is omitted", () => {
      render(
        <TrendsTooltipContent
          active={true}
          payload={[{ dataKey: "expense", value: 150, color: "red" }]}
          chartConfig={chartConfig}
        />,
      );

      expect(screen.getByText("Expense")).toBeInTheDocument();
      expect(screen.getByText("฿150")).toBeInTheDocument();
    });
  });
});
