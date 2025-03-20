import { SensorMetricsDTO } from "@/types/sensorMetrics";
import { getToken, handleResponse, API_BASE_URL } from "./apiHelper";

export async function getDetailedSensorData(
  analysisId: number,
  page: number = 0,
  size: number = 10
): Promise<SensorMetricsDTO[]> {
  const token = getToken();
  const url = `${API_BASE_URL}/data/detailed/${analysisId}?page=${page}&size=${size}`;
  const response = await fetch(url, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse<SensorMetricsDTO[]>(response);
}
