import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SensorMetricsDTO } from "@/types/sensorMetrics";

const RealtimeDashboard: React.FC = () => {
  const router = useRouter();
  const { trainNo: trainNoParam } = router.query;
  // If not provided, default to some integer for demo
  const trainNo =
    typeof trainNoParam === "string" ? parseInt(trainNoParam, 10) : 123;

  const [realtimeMetrics, setRealtimeMetrics] =
    useState<SensorMetricsDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trainNo) return;

    // Direct SSE approach using the plan snippet:
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/realtime/stream?trainNo=${trainNo}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const data: SensorMetricsDTO = JSON.parse(event.data);
        setRealtimeMetrics(data);
      } catch (err) {
        console.error("Error parsing SSE data:", err);
        setError("Failed to parse realtime metrics data.");
      }
    };

    eventSource.onerror = (evt) => {
      console.error("SSE error:", evt);
      setError("Error receiving realtime data.");
      // Optionally close the connection if there is an error
      // eventSource.close();
    };

    // Cleanup to avoid memory leaks:
    return () => {
      eventSource.close();
    };
  }, [trainNo]);

  // Compute derived values if left/right values exist
  const computedAverageVibration =
    realtimeMetrics &&
    realtimeMetrics.averageVibrationLeft !== undefined &&
    realtimeMetrics.averageVibrationRight !== undefined
      ? (realtimeMetrics.averageVibrationLeft +
          realtimeMetrics.averageVibrationRight) /
        2
      : undefined;

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
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
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
          </ul>
        </div>
      ) : (
        !error && <p className="text-gray-600">Waiting for realtime data...</p>
      )}
    </div>
  );
};

export default RealtimeDashboard;
