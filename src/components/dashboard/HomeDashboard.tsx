// src/components/dashboard/HomeDashboard.tsx
import React, { FC } from "react";
import useSWR from "swr";
import KPICard from "@/components/dashboard/KPICard";
import RealTimeStats from "@/components/dashboard/RealTimeStats";
import HistoricalTrends from "@/components/dashboard/HistoricalTrends";
import MaintenanceSchedule from "@/components/maintenance/MaintenanceSchedule";
import { SensorMetricsDTO } from "@/types/sensorMetrics";
import { getToken, API_BASE_URL, handleResponse } from "@/api/apiHelper";
import { MaintenanceRecord } from "@/types/maintenance";

// Define a fetcher for SWR to get the latest sensor metrics
const metricsFetcher = (url: string) =>
  fetch(url, {
    headers: { Authorization: getToken() ? `Bearer ${getToken()}` : "" },
    credentials: "include",
  }).then((res) => handleResponse<SensorMetricsDTO>(res));

// SWR fetcher for maintenance schedule data
const maintenanceFetcher = (url: string) =>
  fetch(url, {
    headers: { Authorization: getToken() ? `Bearer ${getToken()}` : "" },
    credentials: "include",
  }).then((res) => handleResponse<MaintenanceRecord[]>(res));

const HomeDashboard: FC = () => {
  // Fixed analysisId=1 for demonstration; may come from dynamic state in production.
  const { data: metrics, error: metricsError } = useSWR<SensorMetricsDTO>(
    `${API_BASE_URL}/dashboard/latest/1`,
    metricsFetcher,
    { refreshInterval: 30000 }
  );

  // Fetch maintenance schedule using SWR
  const { data: maintenanceSchedule, error: maintenanceError } = useSWR<
    MaintenanceRecord[]
  >(`${API_BASE_URL}/maintenance/schedule`, maintenanceFetcher, {
    refreshInterval: 60000,
  });

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
        {metricsError && (
          <p className="text-red-600">
            Failed to load metrics:{" "}
            {metricsError instanceof Error
              ? metricsError.message
              : "Unknown error"}
          </p>
        )}
        {!metrics && !metricsError && <p>Loading dashboard metrics...</p>}
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

      {/* Upcoming Maintenance Section */}
      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-2xl font-semibold">Upcoming Maintenance</h2>
        {maintenanceError && (
          <p className="text-red-600">
            Failed to load maintenance schedule:{" "}
            {maintenanceError instanceof Error
              ? maintenanceError.message
              : "Unknown error"}
          </p>
        )}
        {!maintenanceSchedule && !maintenanceError && (
          <p>Loading maintenance schedule...</p>
        )}
        {maintenanceSchedule && maintenanceSchedule.length > 0 ? (
          <MaintenanceSchedule items={maintenanceSchedule} />
        ) : (
          maintenanceSchedule &&
          maintenanceSchedule.length === 0 && (
            <p className="text-gray-500 italic">
              No maintenance scheduled in the next 7 days.
            </p>
          )
        )}
      </section>
    </div>
  );
};

export default HomeDashboard;
