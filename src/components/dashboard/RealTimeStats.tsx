// src/components/dashboard/RealTimeStats.tsx

import React from "react";
import useSWR from "swr";
import { getToken, API_BASE_URL, handleResponse } from "@/api/apiHelper";
import { PredictiveMaintenanceResponse } from "@/types/maintenance";

// Define props interface to accept a dynamic analysisId from the parent component
interface RealTimeStatsProps {
  analysisId: number;
}

// Fetcher function to get realtime metrics from the backend endpoint using the dynamic analysisId.
const fetchRealtimeMetrics = async (
  url: string
): Promise<PredictiveMaintenanceResponse> => {
  const token = getToken();
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
    credentials: "include",
  });
  return handleResponse<PredictiveMaintenanceResponse>(response);
};

const RealTimeStats: React.FC<RealTimeStatsProps> = ({ analysisId }) => {
  // Use the dynamic analysisId in the API URL
  const { data, error } = useSWR<PredictiveMaintenanceResponse>(
    `${API_BASE_URL}/realtime/metrics/${analysisId}`,
    fetchRealtimeMetrics,
    { refreshInterval: 10000 } // Refresh every 10 seconds
  );

  if (error) {
    return (
      <div className="bg-white p-4 rounded-md shadow">
        <p className="text-red-600">
          Error loading realtime data:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white p-4 rounded-md shadow">
        <p>Loading realtime train status...</p>
      </div>
    );
  }

  // Compute derived dynamic values
  const riskScore = data.riskScore;
  const status =
    riskScore < 0.3
      ? "Running"
      : riskScore < 0.7
      ? "Delayed"
      : "Maintenance Required";
  const delay =
    riskScore < 0.3 ? "0 min" : riskScore < 0.7 ? "5 min" : "10 min";

  let nextStop = "Central Station";
  if (data.predictionMessage && data.predictionMessage.includes("Next Stop:")) {
    const parts = data.predictionMessage.split("Next Stop:");
    if (parts.length > 1) {
      nextStop = parts[1].trim();
    }
  }

  return (
    <div className="bg-white p-4 rounded-md shadow">
      <h2 className="text-xl font-semibold mb-2">Real-Time Train Status</h2>
      <div className="flex justify-between">
        <p>Status:</p>
        <span className="font-semibold text-green-600">{status}</span>
      </div>
      <div className="flex justify-between mt-2">
        <p>Delay:</p>
        <span className="font-semibold">{delay}</span>
      </div>
      <div className="flex justify-between mt-2">
        <p>Next Stop:</p>
        <span className="font-semibold">{nextStop}</span>
      </div>
    </div>
  );
};

export default RealTimeStats;
