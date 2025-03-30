import { fetchWithAuth, handleResponse } from "@/api/apiHelper";
import { PredictiveMaintenanceResponse } from "@/types/maintenance";

/**
 * Fetch real-time metrics for a given analysisId.
 * Endpoint: GET /api/realtime/metrics/{analysisId}
 */
export async function getRealtimeMetrics(
  analysisId: number
): Promise<PredictiveMaintenanceResponse> {
  const url = `/api/realtime/metrics/${encodeURIComponent(
    analysisId.toString()
  )}`;
  const response = await fetchWithAuth(url, {
    method: "GET",
  });
  return handleResponse<PredictiveMaintenanceResponse>(response);
}

/**
 * Trigger a real-time alert for a given analysisId.
 * Endpoint: POST /api/realtime/alert/{analysisId}?alertEmail={alertEmail}
 */
export async function triggerRealtimeAlert(
  analysisId: number,
  alertEmail: string = "alerts@example.com"
): Promise<void> {
  const url = `/api/realtime/alert/${encodeURIComponent(
    analysisId.toString()
  )}?alertEmail=${encodeURIComponent(alertEmail)}`;
  const response = await fetchWithAuth(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  await handleResponse(response);
}

/**
 * Subscribe to real-time metrics updates for a given train number using SSE.
 * Endpoint: /api/realtime/stream?trainNo={trainNo}
 */
export function subscribeRealtimeMetrics<T>(
  trainNo: number,
  onMessage: (data: T) => void,
  onError?: (error: Event) => void
): EventSource {
  const url = `/api/realtime/stream?trainNo=${encodeURIComponent(
    trainNo.toString()
  )}`;
  // Enable withCredentials so that cookies (if any) are sent with the SSE request.
  const eventSource = new EventSource(url, { withCredentials: true });
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
