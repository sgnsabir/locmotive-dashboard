// src/pages/dashboard/tracking.tsx
import React, { FC } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { RoutePoint } from "@/components/maps/TrainMap";
import { useRouter } from "next/router";
import { API_BASE_URL, getToken, handleResponse } from "@/api/apiHelper";

// Dynamically import TrainMap (client-side only)
const TrainMap = dynamic(() => import("@/components/maps/TrainMap"), {
  ssr: false,
});

// Fallback default train number if none is provided via URL query
const DEFAULT_TRAIN_NO = 123;

// Fetcher for route data from backend
const fetcher = async (url: string): Promise<RoutePoint[]> => {
  const token = getToken();
  const response = await fetch(url, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch route data: ${response.statusText}`);
  }
  return response.json();
};

// Define a type for realtime metrics (safety insights) from the backend
interface RealtimeMetrics {
  riskScore: number;
  alertMessage: string;
  sensorSummary?: string;
  // Additional fields can be added as needed
}

// Fetcher for realtime metrics data
const realtimeFetcher = async (url: string): Promise<RealtimeMetrics> => {
  const token = getToken();
  const response = await fetch(url, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
    credentials: "include",
  });
  return handleResponse<RealtimeMetrics>(response);
};

const Tracking: FC = () => {
  const router = useRouter();
  const { trainNo: queryTrainNo } = router.query;
  // Use dynamic train number from URL; fallback to default if missing
  const trainNo =
    typeof queryTrainNo === "string"
      ? parseInt(queryTrainNo, 10)
      : DEFAULT_TRAIN_NO;

  // Fetch live route data using the dynamic train number
  const { data: routeData, error: routeError } = useSWR<RoutePoint[]>(
    `${API_BASE_URL}/tracking/route?trainNo=${trainNo}`,
    fetcher,
    { refreshInterval: 10000 } // Refresh every 10 seconds
  );

  // Fetch realtime sensor metrics (for safety alerts and insights) using dynamic train number
  const { data: realtimeMetrics, error: realtimeError } =
    useSWR<RealtimeMetrics>(
      `${API_BASE_URL}/tracking/metrics?trainNo=${trainNo}`,
      realtimeFetcher,
      { refreshInterval: 10000 } // Refresh every 10 seconds
    );

  // Determine map center: if route data exists, use the first coordinate; otherwise, fallback
  const mapCenter: RoutePoint =
    routeData && routeData.length > 0 ? routeData[0] : { lat: 0, lng: 0 };

  // Define a risk threshold for alerting (e.g. riskScore >= 0.7 triggers an alert)
  const ALERT_THRESHOLD = 0.7;
  let safetyAlertContent: React.ReactElement = (
    <p className="text-gray-700">No safety alerts at this time.</p>
  );

  if (realtimeError) {
    safetyAlertContent = (
      <p className="text-red-600">
        Error loading safety alerts:{" "}
        {realtimeError instanceof Error
          ? realtimeError.message
          : "Unknown error"}
      </p>
    );
  } else if (realtimeMetrics) {
    if (realtimeMetrics.riskScore >= ALERT_THRESHOLD) {
      safetyAlertContent = (
        <div>
          <p className="text-red-600 font-semibold">
            Alert: High risk detected!
          </p>
          <p className="text-gray-700">{realtimeMetrics.alertMessage}</p>
          {realtimeMetrics.sensorSummary && (
            <p className="text-gray-600 text-sm">
              Sensor Summary: {realtimeMetrics.sensorSummary}
            </p>
          )}
        </div>
      );
    } else {
      safetyAlertContent = (
        <p className="text-green-600">
          Safety parameters within normal range. (Risk Score:{" "}
          {realtimeMetrics.riskScore.toFixed(2)})
        </p>
      );
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Train Tracking &amp; Safety</h1>

      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2">Live GPS Tracking</h2>
        {routeError ? (
          <p className="text-red-600">
            Error loading route data:{" "}
            {routeError instanceof Error ? routeError.message : "Unknown error"}
          </p>
        ) : !routeData ? (
          <p>Loading route data...</p>
        ) : (
          <TrainMap route={routeData} center={mapCenter} zoom={9} />
        )}
      </section>

      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2">Safety Alerts & Insights</h2>
        {safetyAlertContent}
      </section>
    </div>
  );
};

export default Tracking;
