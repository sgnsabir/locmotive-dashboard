import React, { FC } from "react";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { downloadCSV, downloadJSON } from "@/utils/downloads";
import { formatTime } from "@/utils/dateTime";
import BasicLineChart from "@/components/charts/BasicLineChart";

interface EnergyRecord {
  timestamp: string;
  fuelEfficiency: number;
  speed: number;
}

const mockEnergyData: EnergyRecord[] = [
  { timestamp: "2025-01-01T08:00:00.000+01:00", fuelEfficiency: 14, speed: 60 },
  { timestamp: "2025-01-01T09:00:00.000+01:00", fuelEfficiency: 16, speed: 62 },
  // ...
];

const Energy: FC = () => {
  const { startDate, endDate, filteredData, setStartDate, setEndDate } =
    useDateRangeFilter<EnergyRecord>(mockEnergyData);

  const lineChartData = filteredData.map((item) => ({
    time: formatTime(Date.parse(item.timestamp)),
    fuel: item.fuelEfficiency,
  }));

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold">Fuel & Energy Efficiency</h1>

      <section className="bg-white p-4 rounded-md shadow space-y-4">
        <h2 className="text-xl font-semibold">Global Filters & Export</h2>
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
            onClick={() => downloadCSV(filteredData, "energy_data.csv")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download CSV
          </button>
          <button
            onClick={() => downloadJSON(filteredData, "energy_data.json")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download JSON
          </button>
        </div>
      </section>

      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2">
          Fuel Efficiency Over Time
        </h2>
        <BasicLineChart
          data={lineChartData}
          xKey="time"
          lines={[{ dataKey: "fuel", name: "Fuel Efficiency" }]}
        />
      </section>
    </div>
  );
};

export default Energy;
