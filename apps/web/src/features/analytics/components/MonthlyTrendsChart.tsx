import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from "@/shared/components/ui/chart";
import { MonthlyTrendItem } from "../schemas/analytics.response.schema";
import { formatCurrency } from "@/shared/lib/utils/currency.util";
import { format } from "date-fns";
import { th, enUS } from "date-fns/locale";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

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

  const chartConfig: ChartConfig = {
    ...(activeTypes.income && {
      income: {
        label: t("income"),
        color: "var(--semantic-income)",
      },
    }),
    ...(activeTypes.expense && {
      expense: {
        label: t("expense"),
        color: "var(--semantic-expense)",
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
        color: "var(--semantic-highlight)",
      },
    }),
  };

  return (
    <div className="h-50 w-full px-2">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
              tickFormatter={(value) => `฿${value / 1000}k`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCurrency(value as number)}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} verticalAlign="top" />
            {activeTypes.income && (
              <Bar
                dataKey="income"
                fill="var(--color-income)"
                radius={[4, 4, 0, 0]}
                animationDuration={400}
                animationEasing="ease-out"
              />
            )}
            {activeTypes.expense && (
              <Bar
                dataKey="expense"
                fill="var(--color-expense)"
                radius={[4, 4, 0, 0]}
                animationDuration={400}
                animationEasing="ease-out"
              />
            )}
            {activeTypes.transfer && (
              <Bar
                dataKey="transfer"
                fill="var(--color-transfer)"
                radius={[4, 4, 0, 0]}
                animationDuration={400}
                animationEasing="ease-out"
              />
            )}
            {activeTypes.adjust && (
              <Bar
                dataKey="adjust"
                fill="var(--color-adjust)"
                radius={[4, 4, 0, 0]}
                animationDuration={400}
                animationEasing="ease-out"
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
