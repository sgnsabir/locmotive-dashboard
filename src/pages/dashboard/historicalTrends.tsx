// pages/dashboard/historicalTrends.tsx
import React, { FC } from "react";
import BasicLineChart from "@/components/charts/BasicLineChart";

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
      <BasicLineChart
        data={trendData}
        xKey="date"
        lines={[
          { dataKey: "lastTripSpeed", name: "Last Trip Speed" },
          { dataKey: "currentTripSpeed", name: "Current Trip Speed" },
        ]}
        height={300}
      />
    </div>
  );
};

export default HistoricalTrends;
