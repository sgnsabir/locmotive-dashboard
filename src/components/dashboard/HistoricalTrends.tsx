import React, { FC } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const trendData = [
  { date: "2024-12-30", lastTripSpeed: 65, currentTripSpeed: 68 },
  { date: "2024-12-31", lastTripSpeed: 67, currentTripSpeed: 70 },
  { date: "2025-01-01", lastTripSpeed: 64, currentTripSpeed: 66 },
  { date: "2025-01-02", lastTripSpeed: 66, currentTripSpeed: 69 },
  { date: "2025-01-03", lastTripSpeed: 68, currentTripSpeed: 70 },
];

const HistoricalTrends: FC = () => {
  return (
    <div className="bg-white p-4 rounded-md shadow">
      <h2 className="text-xl font-semibold mb-2">
        Historical vs. Current Trends
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={trendData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            label={{ value: "Date", position: "insideBottomRight", offset: 0 }}
          />
          <YAxis
            label={{
              value: "Speed (km/h)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="lastTripSpeed"
            stroke="#8884d8"
            name="Last Trip Speed"
          />
          <Line
            type="monotone"
            dataKey="currentTripSpeed"
            stroke="#82ca9d"
            name="Current Trip Speed"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoricalTrends;
