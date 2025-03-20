import { SteeringAlignmentDTO } from "@/types/steeringAlignment";
import { getToken, handleResponse, API_BASE_URL } from "./apiHelper";

export async function getSteeringData(
  trainNo: number,
  startDate: string,
  endDate: string
): Promise<SteeringAlignmentDTO[]> {
  const token = getToken();
  const url = `${API_BASE_URL}/steering?trainNo=${encodeURIComponent(
    trainNo.toString()
  )}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(
    endDate
  )}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse<SteeringAlignmentDTO[]>(response);
}
