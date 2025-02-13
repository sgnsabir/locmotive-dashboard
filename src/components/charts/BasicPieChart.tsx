// components/charts/BasicPieChart.tsx
import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { COLORS } from "@/constants/chartColors";

interface PieSeries {
  dataKey: string; // field holding the numeric value
  nameKey: string; // field holding the category label
  outerRadius?: number;
  innerRadius?: number; // if >0, renders as a donut
  name?: string;
  color?: string; // optional fixed color; if not provided, uses COLORS array
}

interface BasicPieChartProps<T extends Record<string, unknown>> {
  data: T[];
  pies: PieSeries[]; // supports one or more pie charts
  height?: number;
}

const BasicPieChart = <T extends Record<string, unknown>>({
  data,
  pies,
  height = 300,
}: BasicPieChartProps<T>): React.ReactElement => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Tooltip />
        <Legend />
        {pies.map((pieDef, index) => (
          <Pie
            key={pieDef.name || `pie-${index}`}
            data={data}
            dataKey={pieDef.dataKey}
            nameKey={pieDef.nameKey}
            cx="50%"
            cy="50%"
            outerRadius={pieDef.outerRadius ?? 80}
            innerRadius={pieDef.innerRadius ?? 0}
            label
          >
            {data.map((_, idx) => {
              const fillColor = pieDef.color || COLORS[idx % COLORS.length];
              return <Cell key={`cell-${idx}`} fill={fillColor} />;
            })}
          </Pie>
        ))}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default BasicPieChart;
