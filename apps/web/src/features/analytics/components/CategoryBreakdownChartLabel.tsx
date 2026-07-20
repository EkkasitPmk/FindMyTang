export interface CategoryBreakdownChartLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number;
  percent?: number;
  fill?: string;
  payload?: {
    categoryName: string;
  };
}

export const CategoryBreakdownChartLabel = (
  props: CategoryBreakdownChartLabelProps,
) => {
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    outerRadius = 0,
    payload,
    percent = 0,
    fill = "#000000",
  } = props;
  const RADIAN = Math.PI / 180;

  // ควบคุมระยะห่างจากขอบกราฟได้ที่นี่ (ปรับค่า +10)
  const lineEndRadius = outerRadius + 10;

  const endX = cx + lineEndRadius * Math.cos(-midAngle * RADIAN);
  const endY = cy + lineEndRadius * Math.sin(-midAngle * RADIAN);

  const textAnchor = endX > cx ? "start" : "end";
  // ขยับข้อความออกจากปลายเส้น 2px
  const textX = endX + (endX > cx ? 4 : -4);

  return (
    <g>
      <text
        x={textX}
        y={endY}
        fill={fill}
        textAnchor={textAnchor}
        dominantBaseline="central"
        className="text-[10px] font-medium"
      >
        <tspan x={textX} dy="-0em">
          • {payload?.categoryName || ""} {(percent * 100).toFixed(0)}%
        </tspan>
      </text>
    </g>
  );
};
