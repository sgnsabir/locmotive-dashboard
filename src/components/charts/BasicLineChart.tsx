// components/charts/BasicLineChart.tsx
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
} from "recharts";
import { COLORS } from "@/constants/chartColors";

interface LineProps {
  dataKey: string;
  color?: string;
  name?: string;
}

interface BasicLineChartProps<T extends Record<string, unknown>> {
  data: T[];
  xKey: keyof T;
  lines: LineProps[];
  height?: number;
}

const BasicLineChart = <T extends Record<string, unknown>>({
  data,
  xKey,
  lines,
  height = 300,
}: BasicLineChartProps<T>): React.ReactElement => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey as string} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Brush dataKey={xKey as string} stroke="#8884d8" />
        {lines.map((lineDef, idx) => (
          <Line
            key={lineDef.dataKey}
            type="monotone"
            dataKey={lineDef.dataKey}
            stroke={lineDef.color || COLORS[idx % COLORS.length]}
            name={lineDef.name || lineDef.dataKey}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BasicLineChart;
