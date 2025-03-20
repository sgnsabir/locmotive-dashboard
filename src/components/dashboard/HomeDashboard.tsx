// src/components/dashboard/HomeDashboard.tsx
import React, { FC } from "react";
import useSWR from "swr";
import KPICard from "@/components/dashboard/KPICard";
import RealTimeStats from "@/components/dashboard/RealTimeStats";
import HistoricalTrends from "@/components/dashboard/HistoricalTrends";
import { SensorMetricsDTO } from "@/types/sensorMetrics";
import { getToken, API_BASE_URL, handleResponse } from "@/api/apiHelper";

// Define a fetcher that includes the Authorization header and credentials if needed
const fetcher = (url: string) => {
  const token = getToken();
  return fetch(url, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
    credentials: "include",
  }).then((res) => handleResponse<SensorMetricsDTO>(res));
};

const HomeDashboard: FC = () => {
  // Using a fixed analysisId=1 for demonstration; in production this may come from dynamic state or user context.
  const { data: metrics, error } = useSWR<SensorMetricsDTO>(
    `${API_BASE_URL}/dashboard/latest/1`,
    fetcher,
    { refreshInterval: 30000 } // Refresh data every 30s
  );

  // Map the fetched metrics to KPI card data
  const kpiData = [
    {
      title: "Average Speed",
      value: metrics?.averageSpeed
        ? `${metrics.averageSpeed.toFixed(2)} km/h`
        : "N/A",
    },
    {
      title: "Average AOA",
      value: metrics?.averageAoa ? `${metrics.averageAoa.toFixed(2)}°` : "N/A",
    },
    {
      title: "Average Vibration",
      value:
        metrics?.averageVibrationLeft !== undefined &&
        metrics?.averageVibrationRight !== undefined
          ? `${(
              (metrics.averageVibrationLeft + metrics.averageVibrationRight) /
              2
            ).toFixed(2)} m/s²`
          : "N/A",
    },
    {
      title: "Health Score",
      // Assuming riskScore is between 0 and 1, convert to percentage health score (100 - risk*100)
      value:
        metrics?.riskScore !== undefined
          ? `${(100 - metrics.riskScore * 100).toFixed(0)}%`
          : "N/A",
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>
        {error && (
          <p className="text-red-600">
            Failed to load metrics:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        )}
        {!metrics && !error && <p>Loading dashboard metrics...</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>
      </section>

      <section>
        <RealTimeStats />
      </section>

      <section>
        <HistoricalTrends />
      </section>

      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-2xl font-semibold">Upcoming Maintenance</h2>
        <p>No maintenance scheduled in the next 7 days.</p>
      </section>
    </div>
  );
};

export default HomeDashboard;
