// src/pages/dashboard/historicalTrends.tsx
import React, { FC, useMemo } from "react";
import BasicLineChart from "@/components/charts/BasicLineChart";
import useSWR from "swr";
import { API_BASE_URL, getToken, handleResponse } from "@/api/apiHelper";
import { formatDate } from "@/utils/dateTime";
import { HistoricalTrendsResponse } from "@/types/historicalData";

// SWR fetcher function for the historical trends endpoint
const fetcher = (url: string) =>
  fetch(url, {
    headers: { Authorization: getToken() ? `Bearer ${getToken()}` : "" },
    credentials: "include",
  }).then((res) => handleResponse<HistoricalTrendsResponse>(res));

const analysisId = 1; // This can be made dynamic based on user selection or context

const HistoricalTrends: FC = () => {
  const { data, error } = useSWR<HistoricalTrendsResponse>(
    `${API_BASE_URL}/dashboard/historical/${analysisId}`,
    fetcher,
    { refreshInterval: 60000 } // Refresh the data every 60 seconds
  );

  // Process the fetched data into the structure expected by the chart:
  // each record must include a 'date' property and the numeric trend values.
  const trendData = useMemo(() => {
    if (!data || !data.metricsHistory) return [];
    return data.metricsHistory.map((record) => ({
      date: formatDate(record.createdAt),
      lastTripSpeed: record.lastTripSpeed,
      currentTripSpeed: record.currentTripSpeed,
    }));
  }, [data]);

  if (error) {
    return (
      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2">
          Historical vs. Current Trends
        </h2>
        <p className="text-red-600">
          Error loading trends:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!data) {
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
