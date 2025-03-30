// src/api/derailment.ts

import { DerailmentRiskDTO } from "@/types/derailment";
import { fetchWithAuth, handleResponse } from "@/api/apiHelper";

/**
 * Fetches derailment risk data for a given train number within the specified date range.
 * The API call uses a relative URL so that the Next.js rewrite rule proxies it to the backend.
 * A simple retry logic is applied if an HTTP 429 response is encountered.
 *
 * @param trainNo - The train number for which to fetch the derailment data.
 * @param startDate - The ISO string representing the start date.
 * @param endDate - The ISO string representing the end date.
 * @returns A promise resolving to an array of DerailmentRiskDTO objects.
 */
export async function getDerailmentRiskData(
  trainNo: number,
  startDate: string,
  endDate: string
): Promise<DerailmentRiskDTO[]> {
  // Build relative URL with proper URL encoding for query parameters.
  const url = `/api/derailment?trainNo=${encodeURIComponent(
    trainNo.toString()
  )}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(
    endDate
  )}`;

  try {
    // First attempt to fetch using our centralized fetchWithAuth helper.
    let response = await fetchWithAuth(url, {
      // "mode": "cors" is intentionally omitted; using relative URL makes it same-origin.
      // "credentials": "include" is already handled within fetchWithAuth.
    });

    // If the response status is 429 (Too Many Requests), wait and retry once.
    if (response.status === 429) {
      console.log("HTTP 429 received. Retrying after a short delay.");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second.
      response = await fetchWithAuth(url, {});
    }

    // Process the response using the centralized error handling.
    return await handleResponse<DerailmentRiskDTO[]>(response);
  } catch (error) {
    console.log(error);
    console.error("Error fetching derailment risk data:", error);
    throw error;
  }
}
