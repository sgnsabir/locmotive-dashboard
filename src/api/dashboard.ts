import { SensorMetricsDTO } from "@/types/sensorMetrics";
import { HistoricalDataResponse } from "@/types/historicalData";
import { PerformanceDTO } from "@/types/performance";
import { getToken, handleResponse, API_BASE_URL } from "./apiHelper";

export async function getLatestMetrics(
  analysisId: number
): Promise<SensorMetricsDTO> {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/dashboard/latest/${analysisId}`,
    {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    }
  );
  return handleResponse<SensorMetricsDTO>(response);
}

export async function getHistoricalData(
  analysisId: number
): Promise<HistoricalDataResponse> {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/dashboard/historical/${analysisId}`,
    {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    }
  );
  return handleResponse<HistoricalDataResponse>(response);
}

export async function getPerformanceData(
  startDate: string,
  endDate: string
): Promise<PerformanceDTO[]> {
  const token = getToken();
  const url = `${API_BASE_URL}/performance?startDate=${encodeURIComponent(
    startDate
  )}&endDate=${encodeURIComponent(endDate)}`;
  const response = await fetch(url, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse<PerformanceDTO[]>(response);
}
