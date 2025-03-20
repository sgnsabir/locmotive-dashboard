import { DerailmentRiskDTO } from "@/types/derailment";
import { getToken, handleResponse, API_BASE_URL } from "./apiHelper";

export async function getDerailmentRiskData(
  trainNo: number,
  startDate: string,
  endDate: string
): Promise<DerailmentRiskDTO[]> {
  const token = getToken();
  const url = `${API_BASE_URL}/derailment?trainNo=${encodeURIComponent(
    trainNo.toString()
  )}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(
    endDate
  )}`;
  const response = await fetch(url, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse<DerailmentRiskDTO[]>(response);
}
