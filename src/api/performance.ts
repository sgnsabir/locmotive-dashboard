// src/api/performance.ts
import { fetchWithAuth, handleResponse } from "@/api/apiHelper";
import { PerformanceDTO } from "@/types/performance";

/**
 * Fetch performance data for the given date range.
 * @param startDate ISO formatted start date.
 * @param endDate ISO formatted end date.
 * @returns A promise that resolves to an array of PerformanceDTO.
 */
export async function getPerformanceData(
  startDate: string,
  endDate: string
): Promise<PerformanceDTO[]> {
  try {
    // Construct relative URL with encoded query parameters.
    const url = `/api/performance?startDate=${encodeURIComponent(
      startDate
    )}&endDate=${encodeURIComponent(endDate)}`;

    // Use fetchWithAuth to attach authorization tokens and include credentials.
    const response = await fetchWithAuth(url, {
      method: "GET",
      credentials: "include",
    });

    // Process and return the response.
    return await handleResponse<PerformanceDTO[]>(response);
  } catch (error) {
    console.error("Error fetching performance data:", error);
    throw error;
  }
}
