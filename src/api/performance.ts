import { PerformanceDTO } from "@/types/performance";
import { getToken, handleResponse, API_BASE_URL } from "./apiHelper";

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
