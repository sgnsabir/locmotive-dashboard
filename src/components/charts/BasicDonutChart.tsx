// components/charts/BasicDonutChart.tsx
import React, { FC } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { COLORS } from "@/constants/chartColors";

interface DonutDataItem {
  name: string;
  value: number;
  fill?: string;
}

interface BasicDonutChartProps {
  data: DonutDataItem[];
  height?: number;
  outerRadius?: number;
  innerRadius?: number;
  showLegend?: boolean;
}

const BasicDonutChart: FC<BasicDonutChartProps> = ({
  data,
  height = 300,
  outerRadius = 80,
  innerRadius = 40,
  showLegend = true,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        {showLegend && <Legend />}
        <Tooltip />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          label
        >
          {data.map((entry, idx) => (
            <Cell
              key={`cell-${idx}`}
              fill={entry.fill || COLORS[idx % COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default BasicDonutChart;
