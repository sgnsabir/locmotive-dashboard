// src/api/track.ts

import { TrackConditionDTO } from "@/types/trackCondition";
import { fetchWithAuth, handleResponse } from "./apiHelper";

/**
 * Retrieves track condition data for a given train number and date range.
 * This request uses a relative URL so that Next.js rewrite rules proxy it to the backend.
 * The fetchWithAuth helper attaches the authorization header (if a token exists),
 * handles token refresh on 401 errors, and ensures credentials (cookies) are included.
 *
 * @param trainNo - Train number for which to fetch track conditions.
 * @param startDate - Start date in ISO format.
 * @param endDate - End date in ISO format.
 * @returns A promise that resolves to an array of TrackConditionDTO objects.
 */
export async function getTrackConditionData(
  trainNo: number,
  startDate: string,
  endDate: string
): Promise<TrackConditionDTO[]> {
  const url = `/api/track?trainNo=${encodeURIComponent(
    trainNo.toString()
  )}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(
    endDate
  )}`;
  const response = await fetchWithAuth(url, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse<TrackConditionDTO[]>(response);
}
