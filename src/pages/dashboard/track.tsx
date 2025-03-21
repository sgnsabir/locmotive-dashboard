// src/pages/dashboard/track.tsx
import React, { FC, useState, useMemo, ChangeEvent } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import BasicLineChart from "@/components/charts/BasicLineChart";
import { downloadCSV, downloadJSON } from "@/utils/downloads";
import { formatDate } from "@/utils/dateTime";
import { getTrackConditionData } from "@/api/track";
import { API_BASE_URL } from "@/api/apiHelper";
import { TrackConditionDTO } from "@/types/trackCondition";

const Track: FC = () => {
  const router = useRouter();
  const { trainNo: queryTrainNo } = router.query;
  // Use dynamic train number from URL query; fallback to 123 if missing.
  const trainNo =
    typeof queryTrainNo === "string" ? parseInt(queryTrainNo, 10) : 123;

  // Date filters: default to last 7 days to today (YYYY-MM-DD format)
  const defaultEndDate = new Date().toISOString().split("T")[0];
  const defaultStartDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const [startDate, setStartDate] = useState<string>(defaultStartDate);
  const [endDate, setEndDate] = useState<string>(defaultEndDate);

  // Fetch track condition data dynamically based on trainNo and date range.
  const { data, error } = useSWR<TrackConditionDTO[]>(
    `${API_BASE_URL}/track?trainNo=${trainNo}&startDate=${startDate}&endDate=${endDate}`,
    () => getTrackConditionData(trainNo, startDate, endDate),
    { refreshInterval: 60000 }
  );

  // Compute chart data: average lateral and vertical forces.
  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((item) => {
      const lateralAvg = (item.lateralForceLeft + item.lateralForceRight) / 2;
      const verticalAvg =
        (item.verticalForceLeft + item.verticalForceRight) / 2;
      return {
        date: formatDate(item.measurementTime),
        lateralAvg,
        verticalAvg,
      };
    });
  }, [data]);

  // Update train number dynamically via router query.
  const handleTrainNoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTrainNo = e.target.value;
    router.push({
      pathname: router.pathname,
      query: { ...router.query, trainNo: newTrainNo },
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold">Track & Infrastructure Health</h1>

      {/* Filter Section */}
      <section className="bg-white p-4 rounded-md shadow space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Train Number
            </label>
            <input
              type="number"
              value={trainNo}
              onChange={handleTrainNoChange}
              className="border rounded p-2 w-24"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setStartDate(e.target.value)
              }
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
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEndDate(e.target.value)
              }
              className="border rounded p-2"
            />
          </div>
          <button
            onClick={() => data && downloadCSV(data, "track_conditions.csv")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download CSV
          </button>
          <button
            onClick={() => data && downloadJSON(data, "track_conditions.json")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download JSON
          </button>
        </div>
      </section>

      {/* Chart Section */}
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
            <h2 className="text-xl font-semibold mb-2">Average Forces Trend</h2>
            <BasicLineChart
              data={chartData}
              xKey="date"
              lines={[
                {
                  dataKey: "lateralAvg",
                  name: "Avg Lateral Force (kN)",
                  color: "#8884d8",
                },
                {
                  dataKey: "verticalAvg",
                  name: "Avg Vertical Force (kN)",
                  color: "#82ca9d",
                },
              ]}
              height={300}
            />
          </>
        )}
      </section>

      {/* Detailed Data Table */}
      {data && data.length > 0 && (
        <section className="bg-white p-4 rounded-md shadow overflow-x-auto">
          <h2 className="text-xl font-semibold mb-2">
            Detailed Track Conditions
          </h2>
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Measurement Time</th>
                <th className="px-4 py-2 border">Lateral Force Left (kN)</th>
                <th className="px-4 py-2 border">Lateral Force Right (kN)</th>
                <th className="px-4 py-2 border">Vertical Force Left (kN)</th>
                <th className="px-4 py-2 border">Vertical Force Right (kN)</th>
                <th className="px-4 py-2 border">High Lateral</th>
                <th className="px-4 py-2 border">High Vertical</th>
                <th className="px-4 py-2 border">Anomaly Message</th>
                <th className="px-4 py-2 border">Track Quality Score</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="px-4 py-2 border">
                    {formatDate(item.measurementTime)}
                  </td>
                  <td className="px-4 py-2 border">{item.lateralForceLeft}</td>
                  <td className="px-4 py-2 border">{item.lateralForceRight}</td>
                  <td className="px-4 py-2 border">{item.verticalForceLeft}</td>
                  <td className="px-4 py-2 border">
                    {item.verticalForceRight}
                  </td>
                  <td className="px-4 py-2 border">
                    {item.highLateralForce ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2 border">
                    {item.highVerticalForce ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2 border">
                    {item.anomalyMessage || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {item.trackQualityScore !== undefined
                      ? item.trackQualityScore
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default Track;
