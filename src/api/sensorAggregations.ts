import { AggregatedMetricsResponse } from "@/types/sensorMetrics";
import { getToken, handleResponse, API_BASE_URL } from "./apiHelper";

export async function getSensorAverages(): Promise<AggregatedMetricsResponse> {
  const token = getToken();
  const url = `${API_BASE_URL}/sensor/averages`;
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse<AggregatedMetricsResponse>(response);
}
