// src/api/tracking.ts

import { fetchWithAuth, handleResponse } from "@/api/apiHelper";
import { RoutePoint } from "@/components/maps/TrainMap";

/**
 * Interface for realtime tracking metrics.
 */
export interface RealtimeMetrics {
  riskScore: number;
  alertMessage: string;
  sensorSummary?: string;
  // Additional fields can be added as needed.
}

/**
 * Fetches the tracking route for the given train number.
 * Uses a relative URL so that Next.js rewrites proxy the call.
 */
export async function getTrackingRoute(trainNo: number): Promise<RoutePoint[]> {
  try {
    const response = await fetchWithAuth(
      `/api/tracking/route?trainNo=${trainNo}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    return await handleResponse<RoutePoint[]>(response);
  } catch (error) {
    console.log(error);
    console.error("Error fetching tracking route:", error);
    throw error;
  }
}

/**
 * Fetches the realtime tracking metrics for the given train number.
 * Uses a relative URL so that Next.js rewrites proxy the call.
 */
export async function getTrackingMetrics(
  trainNo: number
): Promise<RealtimeMetrics> {
  try {
    const response = await fetchWithAuth(
      `/api/tracking/metrics?trainNo=${trainNo}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    return await handleResponse<RealtimeMetrics>(response);
  } catch (error) {
    console.log(error);
    console.error("Error fetching tracking metrics:", error);
    throw error;
  }
}
