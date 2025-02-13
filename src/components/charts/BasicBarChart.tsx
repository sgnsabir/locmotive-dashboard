// components/charts/BasicBarChart.tsx
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
} from "recharts";
import { COLORS } from "@/constants/chartColors";

interface BarProps {
  dataKey: string;
  color?: string;
  name?: string;
}

interface BasicBarChartProps<T extends Record<string, unknown>> {
  data: T[];
  xKey: keyof T;
  bars: BarProps[];
  height?: number;
}

const BasicBarChart = <T extends Record<string, unknown>>({
  data,
  xKey,
  bars,
  height = 300,
}: BasicBarChartProps<T>): React.ReactElement => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey as string} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Brush dataKey={xKey as string} stroke="#8884d8" />
        {bars.map((barDef, index) => (
          <Bar
            key={barDef.dataKey}
            dataKey={barDef.dataKey}
            fill={barDef.color || COLORS[index % COLORS.length]}
            name={barDef.name || barDef.dataKey}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BasicBarChart;
