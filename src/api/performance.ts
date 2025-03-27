// src/api/performance.ts
import { PerformanceDTO } from "@/types/performance";
import { getToken, handleResponse, API_BASE_URL } from "./apiHelper";

/**
 * Fetch performance data for the given date range.
 * @param startDate ISO formatted start date
 * @param endDate ISO formatted end date
 * @returns A promise that resolves to an array of PerformanceDTO
 */
export async function getPerformanceData(
  startDate: string,
  endDate: string
): Promise<PerformanceDTO[]> {
  const token = getToken();
  const url = `${API_BASE_URL}/performance?startDate=${encodeURIComponent(
    startDate
  )}&endDate=${encodeURIComponent(endDate)}`;

  console.debug("[getPerformanceData] Request URL:", url);
  console.debug(
    "[getPerformanceData] Using token:",
    token ? "Present" : "Not present"
  );

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: process.env.NODE_ENV === "production" ? "include" : "omit",
    });

    console.debug("[getPerformanceData] Response status:", response.status);

    if (!response.ok) {
      console.error(
        "[getPerformanceData] Fetch failed with status:",
        response.status
      );
      throw new Error(
        `Failed to fetch performance data. Status: ${response.status}`
      );
    }

    const data = await handleResponse<PerformanceDTO[]>(response);
    console.debug(
      "[getPerformanceData] Successfully fetched performance data:",
      data
    );
    return data;
  } catch (error) {
    console.error("[getPerformanceData] Error during fetch:", error);
    throw error;
  }
}
