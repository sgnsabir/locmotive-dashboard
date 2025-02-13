// pages/dashboard/tracking.tsx
import React, { FC } from "react";
import dynamic from "next/dynamic";
import { RoutePoint } from "@/components/maps/TrainMap";

// Dynamically import TrainMap (client-side only)
const TrainMap = dynamic(() => import("@/components/maps/TrainMap"), {
  ssr: false,
});

const MOCK_ROUTE: RoutePoint[] = [
  { lat: 51.505, lng: -0.09 }, // Starting point near London
  { lat: 51.6, lng: -0.1 },
  { lat: 51.7, lng: -0.05 },
  { lat: 51.8, lng: 0.02 }, // Train's current position
];

const Tracking: FC = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Train Tracking & Safety</h1>

      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2">Live GPS Tracking</h2>
        <TrainMap
          route={MOCK_ROUTE}
          zoom={9}
          center={{ lat: 51.505, lng: -0.09 }}
        />
      </section>

      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-2">Safety Alerts</h2>
        <p className="text-gray-700">
          {/* Placeholder: Implement actual alerts logic as needed */}
          No safety alerts at this time.
        </p>
      </section>
    </div>
  );
};

export default Tracking;
