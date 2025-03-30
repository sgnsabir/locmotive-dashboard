// src/api/dashboard.ts
import { SensorMetricsDTO } from "@/types/sensorMetrics";
import { HistoricalDataResponse } from "@/types/historicalData";
import { fetchWithAuth, handleResponse } from "./apiHelper";

/**
 * Fetches the latest sensor metrics for a given analysisId.
 *
 * Endpoint: GET /api/dashboard/latest/:analysisId
 */
export async function getLatestMetrics(
  analysisId: number
): Promise<SensorMetricsDTO> {
  try {
    const response = await fetchWithAuth(
      `/api/dashboard/latest/${analysisId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    return await handleResponse<SensorMetricsDTO>(response);
  } catch (error) {
    console.error("Error in getLatestMetrics:", error);
    throw error;
  }
}

/**
 * Fetches the historical sensor metrics for a given analysisId.
 *
 * Endpoint: GET /api/dashboard/historical/:analysisId
 */
export async function getHistoricalData(
  analysisId: number
): Promise<HistoricalDataResponse> {
  try {
    const response = await fetchWithAuth(
      `/api/dashboard/historical/${analysisId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    return await handleResponse<HistoricalDataResponse>(response);
  } catch (error) {
    console.error("Error in getHistoricalData:", error);
    throw error;
  }
}
