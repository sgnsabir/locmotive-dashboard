import React, { FC } from "react";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { downloadCSV, downloadJSON } from "@/utils/downloads";
import { formatDate } from "@/utils/dateTime";
import BasicLineChart from "@/components/charts/BasicLineChart";

interface TrackRecord {
  timestamp: string;
  vibration: number;
  axleLoad: number;
}

const mockTrackData: TrackRecord[] = [
  { timestamp: "2025-01-01T08:00:00.000+01:00", vibration: 2.3, axleLoad: 12 },
  { timestamp: "2025-01-02T08:00:00.000+01:00", vibration: 2.5, axleLoad: 13 },
  { timestamp: "2025-01-03T08:00:00.000+01:00", vibration: 2.4, axleLoad: 11 },
  {
    timestamp: "2025-01-04T08:00:00.000+01:00",
    vibration: 2.6,
    axleLoad: 12.5,
  },
];

const Track: FC = () => {
  const { startDate, endDate, filteredData, setStartDate, setEndDate } =
    useDateRangeFilter(mockTrackData);

  const lineData = filteredData.map((item) => ({
    date: formatDate(item.timestamp),
    vibration: item.vibration,
    axle: item.axleLoad,
  }));

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold">Track & Infrastructure Health</h1>

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
            onClick={() => downloadCSV(filteredData, "track.csv")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download CSV
          </button>
          <button
            onClick={() => downloadJSON(filteredData, "track.json")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download JSON
          </button>
        </div>
      </section>

      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2">Vibration Trend</h2>
        <BasicLineChart
          data={lineData}
          xKey="date"
          lines={[
            { dataKey: "vibration", name: "Vibration (m/s²)" },
            { dataKey: "axle", name: "Axle Load (tons)" },
          ]}
        />
      </section>
    </div>
  );
};

export default Track;
