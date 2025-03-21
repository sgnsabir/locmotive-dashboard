// src/components/dashboard/HistoricalTrends.tsx
import React, { FC, useMemo } from "react";
import BasicLineChart from "@/components/charts/BasicLineChart";
import useSWR from "swr";
import { API_BASE_URL, getToken, handleResponse } from "@/api/apiHelper";
import { formatDate } from "@/utils/dateTime";
import { HistoricalTrendsResponse } from "@/types/historicalData";
import { SensorMetricsDTO } from "@/types/sensorMetrics";

interface HistoricalTrendsProps {
  // Dynamic analysisId provided from parent (e.g. via Redux, router query, or settings)
  analysisId?: number;
}

// Generic fetcher function using the API helper
const fetcher = async <T,>(url: string): Promise<T> => {
  const token = getToken();
  const response = await fetch(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    credentials: "include",
  });
  return handleResponse<T>(response);
};

const HistoricalTrends: FC<HistoricalTrendsProps> = ({ analysisId = 1 }) => {
  // Fetch latest metrics using the dynamic analysisId prop.
  const {
    data: latestMetrics,
    error: latestError,
    isValidating: latestLoading,
  } = useSWR<SensorMetricsDTO>(
    `${API_BASE_URL}/dashboard/latest/${analysisId}`,
    fetcher,
    { refreshInterval: 60000 }
  );

  // Use the provided analysisId directly for fetching historical trends.
  const historicalEndpoint = `${API_BASE_URL}/dashboard/historical/${analysisId}`;
  const {
    data: historicalData,
    error: historicalError,
    isValidating: historicalLoading,
  } = useSWR<HistoricalTrendsResponse>(historicalEndpoint, fetcher, {
    refreshInterval: 60000,
  });

  // Map the historical trends into the format expected by the chart.
  const trendData = useMemo(() => {
    if (!historicalData || !historicalData.metricsHistory) return [];
    return historicalData.metricsHistory.map((record) => ({
      date: formatDate(record.createdAt),
      lastTripSpeed: record.lastTripSpeed,
      currentTripSpeed: record.currentTripSpeed,
    }));
  }, [historicalData]);

  if (latestError || historicalError) {
    const errorMessage =
      (latestError && (latestError as Error).message) ||
      (historicalError && (historicalError as Error).message) ||
      "An unknown error occurred while fetching trends data.";
    return (
      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2">
          Historical vs. Current Trends
        </h2>
        <p className="text-red-600">Error loading trends: {errorMessage}</p>
      </div>
    );
  }

  if (latestLoading || historicalLoading || !latestMetrics || !historicalData) {
    return (
      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2">
          Historical vs. Current Trends
        </h2>
        <p>Loading trends...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md shadow">
      <h2 className="text-xl font-semibold mb-2">
        Historical vs. Current Trends
      </h2>
      <BasicLineChart
        data={trendData}
        xKey="date"
        lines={[
          { dataKey: "lastTripSpeed", name: "Last Trip Speed" },
          { dataKey: "currentTripSpeed", name: "Current Trip Speed" },
        ]}
        height={300}
      />
    </div>
  );
};

export default HistoricalTrends;
