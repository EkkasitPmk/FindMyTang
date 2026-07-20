import { PieChart, Pie, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { CategoryBreakdownItem } from "../types/analytics.type";
import { formatCurrency } from "@/shared/lib/utils/currency.util";

import { CategoryBreakdownChartLabel } from "./CategoryBreakdownChartLabel";

interface CategoryBreakdownChartProps {
  data: CategoryBreakdownItem[];
  totalAmount: number;
}

export const CategoryBreakdownChart = ({
  data,
  totalAmount,
}: CategoryBreakdownChartProps) => {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-secondary-text">
        No data for this month
      </div>
    );
  }

  // shadcn chart config is required but we use custom colors from data
  const chartConfig = {
    amount: {
      label: "Amount",
    },
  };

  const chartData = data.map((entry, index) => ({
    ...entry,
    fill: entry.categoryColor || `var(--chart-${(index % 5) + 1})`,
  }));

  return (
    <div className="h-50 relative">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={70}
              paddingAngle={2}
              minAngle={10}
              dataKey="totalAmount"
              stroke="none"
              labelLine={false}
              label={<CategoryBreakdownChartLabel />}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCurrency(value as number)}
                />
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Center Total Amount */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xs text-secondary-text">Total</span>
        <span className="text-lg font-bold text-primary-text">
          {formatCurrency(totalAmount)}
        </span>
      </div>
    </div>
  );
};
