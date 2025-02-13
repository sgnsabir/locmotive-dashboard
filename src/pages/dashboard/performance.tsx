import React, { FC } from "react";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { downloadCSV, downloadJSON } from "@/utils/downloads";
import { formatTime } from "@/utils/dateTime";
import BasicLineChart from "@/components/charts/BasicLineChart";

interface PerformanceRecord {
  timestamp: string;
  speed: number;
  acceleration: number;
}

const mockPerformanceData: PerformanceRecord[] = [
  { timestamp: "2025-01-01T08:00:00.000+01:00", speed: 60, acceleration: 1.2 },
  { timestamp: "2025-01-01T08:10:00.000+01:00", speed: 62, acceleration: 1.1 },
  { timestamp: "2025-01-01T08:20:00.000+01:00", speed: 65, acceleration: 1.3 },
  { timestamp: "2025-01-01T08:30:00.000+01:00", speed: 68, acceleration: 1.0 },
];

const Performance: FC = () => {
  const { startDate, endDate, filteredData, setStartDate, setEndDate } =
    useDateRangeFilter(mockPerformanceData);

  const lineData = filteredData.map((item) => ({
    time: formatTime(Date.parse(item.timestamp)),
    speed: item.speed,
    acc: item.acceleration,
  }));

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold">Train Performance</h1>

      <section className="bg-white p-4 rounded-md shadow space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded p-2"
            />
          </div>
          <button
            onClick={() => downloadCSV(filteredData, "performance.csv")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download CSV
          </button>
          <button
            onClick={() => downloadJSON(filteredData, "performance.json")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download JSON
          </button>
        </div>
      </section>

      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2">Speed Over Time</h2>
        <BasicLineChart
          data={lineData}
          xKey="time"
          lines={[
            { dataKey: "speed", name: "Speed" },
            { dataKey: "acc", name: "Acceleration" },
          ]}
        />
      </section>
    </div>
  );
};

export default Performance;
