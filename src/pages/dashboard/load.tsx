// pages/load.tsx

import React, { FC, useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { getRawData } from "@/api/rawData";
import { RawDataResponse } from "@/types/rawData";
import { downloadCSV, downloadJSON } from "@/utils/downloads";
import { formatDate } from "@/utils/dateTime";
import BasicLineChart from "@/components/charts/BasicLineChart";

const LoadDistributionPage: FC = () => {
  const router = useRouter();
  const { analysisId: analysisIdQuery } = router.query;
  // Use dynamic analysisId from the query parameter; default to 1 if not provided.
  const analysisId =
    typeof analysisIdQuery === "string" ? parseInt(analysisIdQuery, 10) : 1;

  const [rawData, setRawData] = useState<RawDataResponse[]>([]);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [sensorType, setSensorType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch raw data from the backend using the relative endpoint /api/rawData
  useEffect(() => {
    if (!analysisId) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRawData(analysisId, sensorType, page, size);
        setRawData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch raw sensor data");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [analysisId, sensorType, page, size]);

  // Transform raw data for charting.
  const chartData = rawData.map((item) => ({
    date: formatDate(item.createdAt),
    axle: item.sensorType === "axleLoad" ? item.value ?? 0 : 0,
    force: item.sensorType === "force" ? item.value ?? 0 : 0,
  }));

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold">Load &amp; Weight Distribution</h1>
      <section className="bg-white p-4 rounded-md shadow space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Sensor Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sensor Type
            </label>
            <select
              value={sensorType}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSensorType(e.target.value)
              }
              className="border rounded p-2"
            >
              <option value="">All</option>
              <option value="axleLoad">Axle Load</option>
              <option value="force">Force</option>
            </select>
          </div>
          {/* Pagination Controls */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Page
            </label>
            <input
              type="number"
              value={page}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPage(Number(e.target.value))
              }
              className="mt-1 block border rounded p-2 w-20"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Page Size
            </label>
            <input
              type="number"
              value={size}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSize(Number(e.target.value))
              }
              className="mt-1 block border rounded p-2 w-20"
              min="1"
            />
          </div>
          <button
            onClick={() => downloadCSV(rawData, "load_distribution.csv")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download CSV
          </button>
          <button
            onClick={() => downloadJSON(rawData, "load_distribution.json")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download JSON
          </button>
        </div>
      </section>
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <section className="bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-2">Load &amp; Force Trend</h2>
          <BasicLineChart
            data={chartData}
            xKey="date"
            lines={[
              { dataKey: "axle", name: "Axle Load" },
              { dataKey: "force", name: "Force (kN)" },
            ]}
          />
        </section>
      )}
    </div>
  );
};

export default LoadDistributionPage;
