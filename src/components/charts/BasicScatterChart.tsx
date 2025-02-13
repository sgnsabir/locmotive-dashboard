// components/charts/BasicScatterChart.tsx
import React from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
} from "recharts";
import { COLORS } from "@/constants/chartColors";

interface ScatterSeries {
  name?: string;
  dataKeyX: string;
  dataKeyY: string;
  color?: string;
}

interface BasicScatterChartProps<T extends Record<string, unknown>> {
  data: T[];
  scatterSeries: ScatterSeries[]; // one or more scatter series
  height?: number;
}

/**
 * Each item in `data` should be an object with properties that match the scatter series keys.
 */
const BasicScatterChart = <T extends Record<string, unknown>>({
  data,
  scatterSeries,
  height = 300,
}: BasicScatterChartProps<T>): React.ReactElement => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" dataKey={scatterSeries[0]?.dataKeyX} />
        <YAxis type="number" dataKey={scatterSeries[0]?.dataKeyY} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Legend />
        <Brush />
        {scatterSeries.map((series, index) => {
          const fillColor = series.color || COLORS[index % COLORS.length];
          return (
            <Scatter
              key={
                series.name || `${series.dataKeyX}-${series.dataKeyY}-${index}`
              }
              name={series.name || `Scatter ${index + 1}`}
              data={data.map((d) => ({
                x: d[series.dataKeyX],
                y: d[series.dataKeyY],
              }))}
              fill={fillColor}
            />
          );
        })}
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default BasicScatterChart;
