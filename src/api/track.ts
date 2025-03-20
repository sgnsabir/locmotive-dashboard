// src/api/track.ts
import { TrackConditionDTO } from "@/types/trackCondition";
import { getToken, handleResponse, API_BASE_URL } from "./apiHelper";

export async function getTrackConditionData(
  trainNo: number,
  startDate: string,
  endDate: string
): Promise<TrackConditionDTO[]> {
  const token = getToken();
  const url = `${API_BASE_URL}/track?trainNo=${encodeURIComponent(
    trainNo.toString()
  )}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(
    endDate
  )}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse<TrackConditionDTO[]>(response);
}
