// src/pages/dashboard/tracking.tsx
import React, { FC } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { RoutePoint } from "@/components/maps/TrainMap";

// Dynamically import TrainMap (client-side only)
const TrainMap = dynamic(() => import("@/components/maps/TrainMap"), {
  ssr: false,
});

// Default train number; adjust as needed or derive from router query
const defaultTrainNo = 123;

// Define a fetcher that gets JSON from the provided URL.
const fetcher = (url: string): Promise<RoutePoint[]> =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch route data: ${res.statusText}`);
    }
    return res.json();
  });

const Tracking: FC = () => {
  // Use SWR to fetch live GPS route data from the backend endpoint.
  const { data: routeData, error } = useSWR<RoutePoint[]>(
    `/tracking/route?trainNo=${defaultTrainNo}`,
    fetcher,
    { refreshInterval: 10000 } // Refresh route data every 10 seconds
  );

  // Determine the map center; if no route data, default to { lat: 0, lng: 0 }
  const mapCenter: RoutePoint =
    routeData && routeData.length > 0 ? routeData[0] : { lat: 0, lng: 0 };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Train Tracking & Safety</h1>

      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2">Live GPS Tracking</h2>
        {error ? (
          <p className="text-red-600">
            Error loading route data:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        ) : !routeData ? (
          <p>Loading route data...</p>
        ) : (
          <TrainMap route={routeData} center={mapCenter} zoom={9} />
        )}
      </section>

      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2">Safety Alerts</h2>
        <p className="text-gray-700">
          {/* Placeholder for safety alerts - implement actual alerts logic as needed */}
          No safety alerts at this time.
        </p>
      </section>
    </div>
  );
};

export default Tracking;
