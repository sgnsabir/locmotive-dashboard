// components/charts/BasicAreaChart.tsx
import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Brush,
} from "recharts";
import { COLORS } from "@/constants/chartColors";

interface AreaProps {
  dataKey: string;
  color?: string;
  name?: string;
}

interface BasicAreaChartProps<T extends Record<string, unknown>> {
  data: T[];
  xKey: keyof T;
  areas: AreaProps[];
  height?: number;
}

const BasicAreaChart = <T extends Record<string, unknown>>({
  data,
  xKey,
  areas,
  height = 300,
}: BasicAreaChartProps<T>) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey as string} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Brush dataKey={xKey as string} stroke="#8884d8" />
        {areas.map((areaDef, index) => (
          <Area
            key={areaDef.dataKey}
            type="monotone"
            dataKey={areaDef.dataKey}
            stroke={areaDef.color || COLORS[index % COLORS.length]}
            fill={areaDef.color || COLORS[index % COLORS.length]}
            name={areaDef.name || areaDef.dataKey}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default BasicAreaChart;
