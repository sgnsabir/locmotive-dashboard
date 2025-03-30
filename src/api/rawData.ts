// src/api/rawData.ts

import { fetchWithAuth, handleResponse } from "@/api/apiHelper";
import { RawDataResponse } from "@/types/rawData";

/**
 * Retrieves raw sensor data for the given analysisId, sensorType, page, and size.
 * Uses a relative URL so that Next.js rewrites proxy the request to the backend.
 * The call uses fetchWithAuth for secure token management and includes credentials.
 */
export async function getRawData(
  analysisId: number,
  sensorType: string = "",
  page: number = 0,
  size: number = 10
): Promise<RawDataResponse[]> {
  try {
    const url = `/api/rawData?analysisId=${analysisId}&sensorType=${encodeURIComponent(
      sensorType
    )}&page=${page}&size=${size}`;
    const response = await fetchWithAuth(url, {
      method: "GET",
      credentials: "include",
    });
    return await handleResponse<RawDataResponse[]>(response);
  } catch (error) {
    console.log(error);
    console.error("Error fetching raw data:", error);
    throw error;
  }
}
