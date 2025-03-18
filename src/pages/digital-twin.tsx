// src/pages/digital-twin.tsx
import React from "react";
import Head from "next/head";
import { useSSE } from "@/hooks/useSSE";
import { VirtualAssetDTO } from "@/api"; // Ensure VirtualAssetDTO is defined in your API types

const DigitalTwinPage: React.FC = () => {
  // For demo purposes, we use a fixed asset ID.
  // In a real application, this might come from route params or user selection.
  const assetId = 1;
  const sseEndpoint = `/digital-twin/stream/${assetId}`;

  // Subscribe to the digital twin SSE stream.
  // The hook is strongly typed to VirtualAssetDTO.
  const { data, error } = useSSE<VirtualAssetDTO>(sseEndpoint, [assetId]);

  return (
    <>
      <Head>
        <title>Digital Twin Dashboard</title>
      </Head>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Digital Twin Dashboard</h1>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            Error: {error.message}
          </div>
        )}
        {!data && !error && (
          <div className="mb-4 p-4 bg-gray-100 text-gray-700 rounded">
            Loading digital twin data...
          </div>
        )}
        {data && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-3">
              Asset ID: {data.assetId}
            </h2>
            <p className="mb-2">
              <strong>Status:</strong> {data.status}
            </p>
            <p className="mb-2">
              <strong>Last Updated:</strong>{" "}
              {new Date(data.updatedAt).toLocaleString()}
            </p>
            <p>
              <strong>Sensor Summary:</strong> {data.sensorSummary}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default DigitalTwinPage;
