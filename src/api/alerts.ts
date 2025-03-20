//src/api/alerts.ts
import { AlertAcknowledgeRequest, AlertResponse } from "@/types/alert";
import { getToken, handleResponse, API_BASE_URL } from "./apiHelper";

export async function getAlerts(): Promise<AlertResponse[]> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/alerts`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse<AlertResponse[]>(response);
}

export async function acknowledgeAlert(
  request: AlertAcknowledgeRequest
): Promise<void> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/alerts/acknowledge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(request),
  });
  await handleResponse(response);
}

export async function getAlertById(alertId: number): Promise<AlertResponse> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/alerts/${alertId}`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse<AlertResponse>(response);
}
