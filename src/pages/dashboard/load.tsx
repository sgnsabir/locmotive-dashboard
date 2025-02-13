import React, { FC } from "react";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { downloadCSV, downloadJSON } from "@/utils/downloads";
import { formatDate } from "@/utils/dateTime";
import BasicLineChart from "@/components/charts/BasicLineChart";

interface LoadRecord {
  timestamp: string;
  axleLoad: number;
  force: number;
}

const mockLoadData: LoadRecord[] = [
  { timestamp: "2025-01-01T08:00:00.000+01:00", axleLoad: 10, force: 80 },
  { timestamp: "2025-01-02T08:00:00.000+01:00", axleLoad: 12, force: 120 },
  { timestamp: "2025-01-03T08:00:00.000+01:00", axleLoad: 11, force: 90 },
  { timestamp: "2025-01-04T08:00:00.000+01:00", axleLoad: 15, force: 150 },
];

const LoadDistributionPage: FC = () => {
  const { startDate, endDate, filteredData, setStartDate, setEndDate } =
    useDateRangeFilter(mockLoadData);

  const lineData = filteredData.map((item) => ({
    date: formatDate(item.timestamp),
    axle: item.axleLoad,
    force: item.force,
  }));

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold">Load & Weight Distribution</h1>

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
            onClick={() => downloadCSV(filteredData, "load_distribution.csv")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download CSV
          </button>
          <button
            onClick={() => downloadJSON(filteredData, "load_distribution.json")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download JSON
          </button>
        </div>
      </section>

      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2">Load & Force Trend</h2>
        <BasicLineChart
          data={lineData}
          xKey="date"
          lines={[
            { dataKey: "axle", name: "Axle Load" },
            { dataKey: "force", name: "Force (kN)" },
          ]}
        />
      </section>
    </div>
  );
};

export default LoadDistributionPage;
