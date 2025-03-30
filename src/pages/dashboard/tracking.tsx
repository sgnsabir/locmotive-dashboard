// src/pages/dashboard/tracking.tsx

import React, { FC } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { useRouter } from "next/router";
import { fetchWithAuth, handleResponse } from "@/api/apiHelper";
import { RoutePoint } from "@/components/maps/TrainMap";

// Dynamically import the TrainMap component (client-side only)
const TrainMap = dynamic(() => import("@/components/maps/TrainMap"), {
  ssr: false,
});

// Define the type for realtime tracking metrics
export interface RealtimeMetrics {
  riskScore: number;
  alertMessage: string;
  sensorSummary?: string;
  // Additional fields can be added as needed
}

// Fetcher for live GPS route using relative URL and our centralized fetchWithAuth
const fetchTrackingRoute = async (trainNo: number): Promise<RoutePoint[]> => {
  const response = await fetchWithAuth(
    `/api/tracking/route?trainNo=${trainNo}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  return handleResponse<RoutePoint[]>(response);
};

// Fetcher for safety metrics using relative URL
const fetchTrackingMetrics = async (
  trainNo: number
): Promise<RealtimeMetrics> => {
  const response = await fetchWithAuth(
    `/api/tracking/metrics?trainNo=${trainNo}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  return handleResponse<RealtimeMetrics>(response);
};

const Tracking: FC = () => {
  const router = useRouter();
  const { trainNo: queryTrainNo } = router.query;
  // Parse train number from query; default to 123 if not provided or invalid
  const trainNo =
    typeof queryTrainNo === "string" && !isNaN(parseInt(queryTrainNo, 10))
      ? parseInt(queryTrainNo, 10)
      : 123;

  // Use SWR to fetch live GPS route data
  const {
    data: routeData,
    error: routeError,
    isValidating: routeLoading,
  } = useSWR<RoutePoint[]>(
    `/api/tracking/route?trainNo=${trainNo}`,
    () => fetchTrackingRoute(trainNo),
    {
      refreshInterval: 10000, // refresh every 10 seconds
      dedupingInterval: 5000,
    }
  );

  // Use SWR to fetch safety metrics
  const {
    data: metricsData,
    error: metricsError,
    isValidating: metricsLoading,
  } = useSWR<RealtimeMetrics>(
    `/api/tracking/metrics?trainNo=${trainNo}`,
    () => fetchTrackingMetrics(trainNo),
    {
      refreshInterval: 10000, // refresh every 10 seconds
      dedupingInterval: 5000,
    }
  );

  // Determine map center: if route data exists, use the first point; otherwise, fallback to {lat: 0, lng: 0}
  const mapCenter: RoutePoint =
    routeData && routeData.length > 0 ? routeData[0] : { lat: 0, lng: 0 };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold">Train Tracking &amp; Safety</h1>

      {/* Live GPS Tracking Section */}
      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2">Live GPS Tracking</h2>
        {routeLoading && <p>Loading route data...</p>}
        {routeError && (
          <p className="text-red-600">
            Error loading route data:{" "}
            {routeError instanceof Error ? routeError.message : "Unknown error"}
          </p>
        )}
        {routeData && routeData.length > 0 ? (
          <TrainMap route={routeData} center={mapCenter} zoom={9} />
        ) : (
          !routeLoading && <p>No route data available.</p>
        )}
      </section>

      {/* Safety Metrics Section */}
      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2">Safety Metrics</h2>
        {metricsLoading && <p>Loading safety metrics...</p>}
        {metricsError && (
          <p className="text-red-600">
            Error loading safety metrics:{" "}
            {metricsError instanceof Error
              ? metricsError.message
              : "Unknown error"}
          </p>
        )}
        {metricsData && (
          <div>
            {metricsData.riskScore >= 0.7 ? (
              <p className="text-red-600 font-bold">High Risk Detected!</p>
            ) : (
              <p className="text-green-600">
                Safety parameters within normal range.
              </p>
            )}
            <p>
              <strong>Risk Score:</strong> {metricsData.riskScore.toFixed(2)}
            </p>
            <p>
              <strong>Alert Message:</strong> {metricsData.alertMessage}
            </p>
            {metricsData.sensorSummary && (
              <p>
                <strong>Sensor Summary:</strong> {metricsData.sensorSummary}
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Tracking;
