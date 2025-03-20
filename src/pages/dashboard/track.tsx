// src/pages/dashboard/track.tsx
import React, { FC, useState, useMemo } from "react";
import useSWR from "swr";
import BasicLineChart from "@/components/charts/BasicLineChart";
import { downloadCSV, downloadJSON } from "@/utils/downloads";
import { formatDate } from "@/utils/dateTime";
import { getTrackConditionData } from "@/api/track";

const defaultTrainNo = 123; // Default train number; update as needed

const Track: FC = () => {
  // Use ISO date strings (YYYY-MM-DD) for date filters
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // SWR key depends on the date range and train number so that data is refetched on change.
  const swrKey = `/track?trainNo=${defaultTrainNo}&startDate=${startDate}&endDate=${endDate}`;

  // Define fetcher function using the API helper
  const fetcher = () =>
    getTrackConditionData(defaultTrainNo, startDate, endDate);

  // Fetch data with SWR, auto-refresh every 60 seconds.
  const { data, error } = useSWR(swrKey, fetcher, { refreshInterval: 60000 });

  // Transform fetched track condition data into chart data.
  // Assumes each TrackConditionDTO has at least: measurementTime, vibration, axleLoad.
  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({
      date: formatDate(item.measurementTime),
      vibration: item.vibration,
      axle: item.axleLoad,
    }));
  }, [data]);

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold">Track & Infrastructure Health</h1>

      {/* Date filter and export section */}
      <section className="bg-white p-4 rounded-md shadow space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded p-2"
            />
          </div>
          <button
            onClick={() => data && downloadCSV(data, "track.csv")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download CSV
          </button>
          <button
            onClick={() => data && downloadJSON(data, "track.json")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download JSON
          </button>
        </div>
      </section>

      {/* Chart section */}
      <section className="bg-white p-4 rounded-md shadow">
        {error ? (
          <p className="text-red-600">
            Error loading track data:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        ) : !data ? (
          <p>Loading track data...</p>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-2">
              Vibration & Axle Load Trends
            </h2>
            <BasicLineChart
              data={chartData}
              xKey="date"
              lines={[
                { dataKey: "vibration", name: "Vibration (m/s²)" },
                { dataKey: "axle", name: "Axle Load (tons)" },
              ]}
              height={300}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default Track;
