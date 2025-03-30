import React, { useEffect, useState, useCallback } from "react";
import BasicLineChart from "@/components/charts/BasicLineChart";
import { getPerformanceData } from "@/api/performance";
import { formatTime } from "@/utils/dateTime";
import { PerformanceDTO } from "@/types/performance";

const PerformancePage: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Default date range: Last 7 days to now (in ISO format)
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  );
  const [endDate, setEndDate] = useState<string>(new Date().toISOString());

  // Fetch performance data based on the current startDate and endDate.
  const fetchPerformance = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.debug("[PerformancePage] Fetching performance data:", {
      startDate,
      endDate,
    });
    try {
      const data = await getPerformanceData(startDate, endDate);
      console.debug("[PerformancePage] Received performance data:", data);
      setPerformanceData(data);
    } catch (err: unknown) {
      console.error("[PerformancePage] Error fetching performance data:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while fetching performance data.");
      }
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchPerformance();
  }, [fetchPerformance]);

  // Map performance data for chart rendering.
  const chartData = performanceData.map((item) => ({
    time: formatTime(new Date(item.timestamp).getTime()),
    speed: item.speed,
    acceleration: item.acceleration,
  }));

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Train Performance</h1>

      {/* Date Range Filters and Refresh Control */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div>
          <label htmlFor="startDate" className="mr-2 text-sm">
            Start Date:
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate.split("T")[0]}
            onChange={(e) => {
              const newStart = new Date(e.target.value).toISOString();
              console.debug("[PerformancePage] New startDate set:", newStart);
              setStartDate(newStart);
            }}
            className="border rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="mr-2 text-sm">
            End Date:
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate.split("T")[0]}
            onChange={(e) => {
              const newEnd = new Date(e.target.value).toISOString();
              console.debug("[PerformancePage] New endDate set:", newEnd);
              setEndDate(newEnd);
            }}
            className="border rounded p-2"
          />
        </div>
        <button
          onClick={fetchPerformance}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {loading && <p>Loading performance data...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {chartData.length > 0 ? (
        <BasicLineChart
          data={chartData}
          xKey="time"
          lines={[
            { dataKey: "speed", name: "Speed (km/h)" },
            { dataKey: "acceleration", name: "Acceleration (m/s²)" },
          ]}
          height={300}
        />
      ) : (
        !loading && <p>No performance data available.</p>
      )}
    </div>
  );
};

export default PerformancePage;
