import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartConfig,
} from "@/shared/components/ui/chart";
import { MonthlyTrendItem } from "../schemas/analytics.response.schema";
import { formatCompactCurrency } from "@/shared/lib/utils/currency.util";
import { format } from "date-fns";
import { th, enUS } from "date-fns/locale";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import {
  PackedBarShape,
  TrendsTooltipContent,
  TrendsLegendContent,
  ALL_SERIES,
  BAR_GAP,
  calculateTrendsAxisScale,
} from "../helpers/trends-chart.helper";

interface MonthlyTrendsChartProps {
  data: MonthlyTrendItem[];
  year: number;
  activeTypes: {
    income: boolean;
    expense: boolean;
    transfer: boolean;
    adjust: boolean;
  };
}

export const MonthlyTrendsChart = ({
  data,
  year,
  activeTypes,
}: MonthlyTrendsChartProps) => {
  const { t, currentLanguage } = useTranslation();
  const dateLocale = currentLanguage === "th" ? th : enUS;

  const chartData = data.map((item) => ({
    name: format(new Date(year, item.month - 1), "MMM", { locale: dateLocale }),
    income: item.income,
    expense: item.expense,
    transfer: item.transfer,
    adjust: item.adjust,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-100 w-full mb-6 text-secondary-text">
        {t("noDataForThisYear")}
      </div>
    );
  }

  const chartActiveSeries = ALL_SERIES.filter((key) => activeTypes[key]);
  const numActiveSeries = chartActiveSeries.length;

  let minNegative = 0;
  let maxPositive = 0;
  for (const item of chartData) {
    for (const key of chartActiveSeries) {
      const val = Number(item[key]) || 0;
      if (val < minNegative) minNegative = val;
      if (val > maxPositive) maxPositive = val;
    }
  }
  const { ticks, domain } = calculateTrendsAxisScale(minNegative, maxPositive);

  const chartConfig: ChartConfig = {
    ...(activeTypes.expense && {
      expense: {
        label: t("expense"),
        color: "var(--semantic-expense)",
      },
    }),
    ...(activeTypes.income && {
      income: {
        label: t("income"),
        color: "var(--semantic-income)",
      },
    }),
    ...(activeTypes.transfer && {
      transfer: {
        label: t("transfer"),
        color: "var(--semantic-transfer)",
      },
    }),
    ...(activeTypes.adjust && {
      adjust: {
        label: t("adjustment"),
        color: "var(--semantic-info)",
      },
    }),
  };

  return (
    <div className="h-50 w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barGap={BAR_GAP}
            margin={{ top: 0, right: 25, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <ReferenceLine y={0} stroke="var(--border)" strokeWidth={1} />
            <XAxis
              dataKey="name"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval={0}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCompactCurrency}
              ticks={ticks}
              domain={domain}
            />
            <ChartTooltip
              content={<TrendsTooltipContent chartConfig={chartConfig} />}
            />
            <ChartLegend content={<TrendsLegendContent />} position="top" />
            {activeTypes.expense && (
              <Bar
                dataKey="expense"
                fill="var(--color-expense)"
                shape={
                  <PackedBarShape
                    currentKey="expense"
                    fillVar="var(--color-expense)"
                    chartActiveSeries={chartActiveSeries}
                    numActiveSeries={numActiveSeries}
                  />
                }
                animationDuration={300}
                animationEasing="ease-out"
              />
            )}
            {activeTypes.income && (
              <Bar
                dataKey="income"
                fill="var(--color-income)"
                shape={
                  <PackedBarShape
                    currentKey="income"
                    fillVar="var(--color-income)"
                    chartActiveSeries={chartActiveSeries}
                    numActiveSeries={numActiveSeries}
                  />
                }
                animationDuration={300}
                animationEasing="ease-out"
              />
            )}
            {activeTypes.transfer && (
              <Bar
                dataKey="transfer"
                fill="var(--color-transfer)"
                shape={
                  <PackedBarShape
                    currentKey="transfer"
                    fillVar="var(--color-transfer)"
                    chartActiveSeries={chartActiveSeries}
                    numActiveSeries={numActiveSeries}
                  />
                }
                animationDuration={300}
                animationEasing="ease-out"
              />
            )}
            {activeTypes.adjust && (
              <Bar
                dataKey="adjust"
                fill="var(--color-info)"
                shape={
                  <PackedBarShape
                    currentKey="adjust"
                    fillVar="var(--color-info)"
                    chartActiveSeries={chartActiveSeries}
                    numActiveSeries={numActiveSeries}
                  />
                }
                animationDuration={300}
                animationEasing="ease-out"
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
