import { PredictiveMaintenanceResponse } from "@/types/maintenance";
import { getToken, handleResponse, API_BASE_URL } from "./apiHelper";

export async function getRealtimeMetrics(
  analysisId: number
): Promise<PredictiveMaintenanceResponse> {
  const token = getToken();
  const url = `${API_BASE_URL}/realtime/metrics/${encodeURIComponent(
    analysisId.toString()
  )}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse<PredictiveMaintenanceResponse>(response);
}

export async function triggerRealtimeAlert(
  analysisId: number,
  alertEmail: string = "alerts@example.com"
): Promise<void> {
  const token = getToken();
  const url = `${API_BASE_URL}/realtime/alert/${encodeURIComponent(
    analysisId.toString()
  )}?alertEmail=${encodeURIComponent(alertEmail)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  await handleResponse(response);
}

export function subscribeRealtimeMetrics<T>(
  trainNo: number,
  onMessage: (data: T) => void,
  onError?: (error: Event) => void
): EventSource {
  const url = `${API_BASE_URL}/realtime/stream?trainNo=${encodeURIComponent(
    trainNo.toString()
  )}`;
  const eventSource = new EventSource(url);
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as T;
      onMessage(data);
    } catch (err) {
      console.error("Error parsing SSE data:", err);
    }
  };
  eventSource.onerror = (error) => {
    if (onError) {
      onError(error);
    } else {
      console.error("SSE encountered an error:", error);
    }
  };
  return eventSource;
}
