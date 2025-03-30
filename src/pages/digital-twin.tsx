import React, { useEffect, useState } from "react";
import Head from "next/head";
import { VirtualAssetDTO } from "@/types/digitalTwin";
import {
  getDigitalTwinState,
  subscribeDigitalTwinUpdates,
} from "@/api/digitalTwin";

// In a real application, assetId should be dynamically determined (e.g., via router or user input)
const assetId = 1;

const DigitalTwinPage: React.FC = () => {
  const [digitalTwin, setDigitalTwin] = useState<VirtualAssetDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the current digital twin state using our API helper
    const fetchTwin = async () => {
      try {
        const data = await getDigitalTwinState(assetId);
        setDigitalTwin(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error fetching digital twin state.");
        }
      }
    };

    fetchTwin();

    // Subscribe to real-time updates using SSE
    const eventSource = subscribeDigitalTwinUpdates(assetId);
    eventSource.onmessage = (event) => {
      try {
        const updatedTwin: VirtualAssetDTO = JSON.parse(event.data);
        setDigitalTwin(updatedTwin);
      } catch (err) {
        console.error("Error parsing digital twin SSE data:", err);
        setError("Failed to parse digital twin SSE updates.");
      }
    };

    // Cleanup the EventSource on component unmount
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <>
      <Head>
        <title>Digital Twin Dashboard</title>
      </Head>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Digital Twin Dashboard</h1>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            Error: {error}
          </div>
        )}
        {!digitalTwin && !error && (
          <div className="mb-4 p-4 bg-gray-100 text-gray-700 rounded">
            Loading digital twin data...
          </div>
        )}
        {digitalTwin && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-3">
              Asset ID: {digitalTwin.assetId}
            </h2>
            <p className="mb-2">
              <strong>Status:</strong> {digitalTwin.status}
            </p>
            <p className="mb-2">
              <strong>Last Updated:</strong>{" "}
              {new Date(digitalTwin.updatedAt).toLocaleString()}
            </p>
            <p>
              <strong>Sensor Summary:</strong> {digitalTwin.sensorSummary}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default DigitalTwinPage;
