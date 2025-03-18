// src/pages/dashboard/realtime.tsx

import React from "react";
import { useSSE } from "@/hooks/useSSE";
import type { SensorMetricsDTO } from "@/api";
import { useRouter } from "next/router";

const RealtimeDashboard: React.FC = () => {
  const router = useRouter();
  const { trainNo: trainNoParam } = router.query;
  const trainNo =
    typeof trainNoParam === "string" ? parseInt(trainNoParam, 10) : 123;

  // Construct the SSE endpoint URL. Assumes backend route: GET /api/v1/realtime/stream?trainNo=...
  const streamEndpoint = `/realtime/stream?trainNo=${trainNo}`;

  // Subscribe to the SSE stream using our custom hook.
  const { data: realtimeMetrics, error } = useSSE<SensorMetricsDTO>(
    streamEndpoint,
    [trainNo]
  );

  // Compute average vibration if both left and right values are provided.
  const computedAverageVibration =
    realtimeMetrics &&
    realtimeMetrics.averageVibrationLeft !== undefined &&
    realtimeMetrics.averageVibrationRight !== undefined
      ? (realtimeMetrics.averageVibrationLeft +
          realtimeMetrics.averageVibrationRight) /
        2
      : undefined;

  // Compute average vertical force if both left and right values are provided.
  const computedAverageVerticalForce =
    realtimeMetrics &&
    realtimeMetrics.averageVerticalForceLeft !== undefined &&
    realtimeMetrics.averageVerticalForceRight !== undefined
      ? (realtimeMetrics.averageVerticalForceLeft +
          realtimeMetrics.averageVerticalForceRight) /
        2
      : undefined;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Realtime Dashboard</h1>
      {error && (
        <div className="text-red-600 mb-4">
          Error: {error.message || "Failed to load realtime data."}
        </div>
      )}
      {realtimeMetrics ? (
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-2">
            Latest Metrics for Train {realtimeMetrics.analysisId}
          </h2>
          <ul className="list-disc list-inside">
            <li>
              <strong>Average Speed:</strong> {realtimeMetrics.averageSpeed}{" "}
              km/h
            </li>
            <li>
              <strong>Average AOA:</strong> {realtimeMetrics.averageAoa}
            </li>
            <li>
              <strong>Average Vibration:</strong>{" "}
              {computedAverageVibration !== undefined
                ? computedAverageVibration
                : "N/A"}
            </li>
            <li>
              <strong>Average Vertical Force:</strong>{" "}
              {computedAverageVerticalForce !== undefined
                ? computedAverageVerticalForce
                : "N/A"}
            </li>
            {realtimeMetrics.riskScore !== undefined && (
              <li>
                <strong>Risk Score:</strong> {realtimeMetrics.riskScore}
              </li>
            )}
            {/* Additional metric fields can be added as needed */}
          </ul>
        </div>
      ) : (
        <p className="text-gray-600">Waiting for realtime data...</p>
      )}
    </div>
  );
};

export default RealtimeDashboard;
