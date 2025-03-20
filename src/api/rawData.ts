import { RawDataResponse } from "@/types/rawData";
import { getToken, handleResponse, API_BASE_URL } from "./apiHelper";

export async function getRawData(
  analysisId: number,
  sensorType: string = "",
  page: number = 0,
  size: number = 10
): Promise<RawDataResponse[]> {
  const token = getToken();
  const url = `${API_BASE_URL}/data/raw/${analysisId}?sensorType=${encodeURIComponent(
    sensorType
  )}&page=${page}&size=${size}`;
  const response = await fetch(url, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse<RawDataResponse[]>(response);
}
