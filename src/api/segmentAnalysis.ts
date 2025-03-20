import { SegmentAnalysisDTO } from "@/types/segmentAnalysis";
import { getToken, handleResponse, API_BASE_URL } from "./apiHelper";

export async function getSegmentAnalysisData(
  trainNo: number,
  startDate: string,
  endDate: string
): Promise<SegmentAnalysisDTO[]> {
  const token = getToken();
  const url = `${API_BASE_URL}/segment-analysis?trainNo=${encodeURIComponent(
    trainNo.toString()
  )}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(
    endDate
  )}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse<SegmentAnalysisDTO[]>(response);
}
