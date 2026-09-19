import { Rectangle, getNiceTickValues } from "recharts";
import { ChartConfig, ChartLegendContent } from "@/shared/components/ui/chart";
import { formatCurrency } from "@/shared/lib/utils/currency.util";

export interface TrendsAxisScale {
  ticks: number[];
  domain: [number, number];
}

export function calculateTrendsAxisScale(
  minNegative: number,
  maxPositive: number,
): TrendsAxisScale {
  const safeMax = maxPositive > 0 ? maxPositive : 100;

  if (minNegative >= 0) {
    const ticks = getNiceTickValues([0, safeMax], 5);
    return { ticks, domain: [0, ticks.at(-1) ?? safeMax] };
  }

  const positiveTicks = getNiceTickValues([0, safeMax], 5);
  const step = positiveTicks[1] - positiveTicks[0];

  if (Math.abs(minNegative) < step * 0.6) {
    const domainMin = Math.min(minNegative * 1.2, -step * 0.12);
    return {
      ticks: positiveTicks,
      domain: [domainMin, positiveTicks.at(-1) ?? safeMax],
    };
  }

  const ticks = getNiceTickValues([minNegative, maxPositive], 5);
  return { ticks, domain: [ticks[0], ticks.at(-1) ?? maxPositive] };
}

export const ALL_SERIES = ["expense", "income", "transfer", "adjust"] as const;
export type SeriesKey = (typeof ALL_SERIES)[number];

export const SERIES_ORDER: Record<string, number> = {
  expense: 0,
  income: 1,
  transfer: 2,
  adjust: 3,
};

export const BAR_GAP = 2;

export interface CustomBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number;
  payload?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface PackedBarShapeProps extends CustomBarProps {
  currentKey: SeriesKey;
  fillVar: string;
  chartActiveSeries: SeriesKey[];
  numActiveSeries: number;
}

export interface PackedBarLayout {
  newX: number;
  dynamicBarWidth: number;
}

export function calculatePackedBarLayout({
  x = 0,
  width = 0,
  currentKey,
  chartActiveSeries,
  numActiveSeries,
  payload,
  barGap = BAR_GAP,
}: {
  x?: number;
  width?: number;
  currentKey: SeriesKey;
  chartActiveSeries: SeriesKey[];
  numActiveSeries: number;
  payload?: Record<string, unknown>;
  barGap?: number;
}): PackedBarLayout | null {
  if (width <= 0 || !payload) return null;

  const seriesIndex = chartActiveSeries.indexOf(currentKey);
  if (seriesIndex === -1) return null;

  const step = width + barGap;
  const slot0_x = x - seriesIndex * step;
  const totalCategorySpan =
    numActiveSeries * width + (numActiveSeries - 1) * barGap;

  const monthActiveSeries = chartActiveSeries.filter(
    (k) => (Number(payload[k]) || 0) !== 0,
  );
  const mCount = monthActiveSeries.length;
  const monthIndex = monthActiveSeries.indexOf(currentKey);
  if (monthIndex === -1) return null;

  const dynamicBarWidth = (totalCategorySpan - (mCount - 1) * barGap) / mCount;
  const newX = slot0_x + monthIndex * (dynamicBarWidth + barGap);

  return { newX, dynamicBarWidth };
}

export const PackedBarShape = ({
  currentKey,
  fillVar,
  chartActiveSeries,
  numActiveSeries,
  ...barProps
}: PackedBarShapeProps) => {
  const MIN_BAR_HEIGHT = 5;
  const { x, y, width, height, value, payload } = barProps;
  if (
    value === undefined ||
    value === null ||
    Number(value) === 0 ||
    !payload ||
    y === undefined
  ) {
    return null;
  }

  const layout = calculatePackedBarLayout({
    x,
    width,
    currentKey,
    chartActiveSeries,
    numActiveSeries,
    payload,
    barGap: BAR_GAP,
  });

  if (!layout) return null;

  const rawHeight = Math.abs(height ?? 0);
  const finalHeight = Math.max(rawHeight, MIN_BAR_HEIGHT);
  const base = y + (height ?? 0);
  const isNegative = Number(value) < 0;
  const barY = isNegative ? base : base - finalHeight;
  const radius: [number, number, number, number] = isNegative
    ? [0, 0, 4, 4]
    : [4, 4, 0, 0];

  return (
    <Rectangle
      {...barProps}
      x={layout.newX}
      y={barY}
      width={layout.dynamicBarWidth}
      height={finalHeight}
      fill={fillVar}
      radius={radius}
    />
  );
};
PackedBarShape.displayName = "PackedBarShape";

export interface TrendsTooltipItemProps {
  value: unknown;
  name: string;
  item: {
    color?: string;
    payload?: Record<string, unknown>;
  };
  chartConfig: ChartConfig;
}

export const TrendsTooltipItem = ({
  value,
  name,
  item,
  chartConfig,
}: TrendsTooltipItemProps) => {
  const isAdjust = name === "adjust";
  const rawValue =
    isAdjust && item?.payload?.rawAdjust !== undefined
      ? Number(item.payload.rawAdjust)
      : Number(value);
  const formatted = `${isAdjust && rawValue > 0 ? "+" : ""}${formatCurrency(rawValue)}`;

  return (
    <div className="flex flex-1 items-center justify-between gap-4 leading-none">
      <div className="flex items-center gap-1.5">
        <div
          className="h-2.5 w-2.5 shrink-0 rounded-xs"
          style={{
            backgroundColor:
              item.color || (chartConfig[name as SeriesKey]?.color as string),
          }}
        />
        <span className="text-muted-foreground">
          {chartConfig[name as SeriesKey]?.label ?? name}
        </span>
      </div>
      <span className="font-mono font-medium text-foreground tabular-nums">
        {formatted}
      </span>
    </div>
  );
};
TrendsTooltipItem.displayName = "TrendsTooltipItem";

export interface TrendsLegendContentProps {
  payload?: React.ComponentProps<typeof ChartLegendContent>["payload"];
}

export const TrendsLegendContent = ({ payload }: TrendsLegendContentProps) => {
  const sortedPayload = payload
    ? [...payload].sort((a, b) => {
        const keyA = ((a.dataKey as string) || (a.value as string)) ?? "";
        const keyB = ((b.dataKey as string) || (b.value as string)) ?? "";
        return (SERIES_ORDER[keyA] ?? 99) - (SERIES_ORDER[keyB] ?? 99);
      })
    : undefined;

  return <ChartLegendContent payload={sortedPayload} className="pt-1 pb-4" />;
};
TrendsLegendContent.displayName = "TrendsLegendContent";

export interface TrendsTooltipContentProps {
  active?: boolean;
  payload?: Array<{
    value?: unknown;
    name?: string;
    dataKey?: string;
    color?: string;
    payload?: Record<string, unknown>;
  }>;
  label?: string;
  chartConfig?: ChartConfig;
}

export const TrendsTooltipContent = ({
  active,
  payload,
  label,
  chartConfig,
}: TrendsTooltipContentProps) => {
  if (!active || !payload?.length || !chartConfig) return null;

  return (
    <div className="grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      {label && <div className="font-medium text-foreground">{label}</div>}
      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.value !== undefined && item.value !== null)
          .map((item) => (
            <TrendsTooltipItem
              key={`${item.dataKey ?? item.name}`}
              value={item.value}
              name={(item.dataKey ?? item.name) as string}
              item={item}
              chartConfig={chartConfig}
            />
          ))}
      </div>
    </div>
  );
};
TrendsTooltipContent.displayName = "TrendsTooltipContent";
