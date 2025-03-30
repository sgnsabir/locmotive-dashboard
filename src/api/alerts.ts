// src/api/alerts.ts
import { fetchWithAuth, handleResponse } from "./apiHelper";
import { AlertResponse, AlertAcknowledgeRequest } from "@/types/alert";

/**
 * Fetches the list of alerts.
 * Uses relative endpoint: /api/alerts
 */
export async function getAlerts(): Promise<AlertResponse[]> {
  try {
    const response = await fetchWithAuth("/api/alerts", {
      method: "GET",
      credentials: "include",
    });
    return await handleResponse<AlertResponse[]>(response);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    throw error;
  }
}

/**
 * Fetches the details of a single alert by its ID.
 * Uses relative endpoint: /api/alerts/{id}
 */
export async function getAlertById(alertId: number): Promise<AlertResponse> {
  try {
    const response = await fetchWithAuth(`/api/alerts/${alertId}`, {
      method: "GET",
      credentials: "include",
    });
    return await handleResponse<AlertResponse>(response);
  } catch (error) {
    console.error(`Error fetching alert with id ${alertId}:`, error);
    throw error;
  }
}

/**
 * Sends an acknowledgement for a given alert.
 * Uses relative endpoint: /api/alerts/acknowledge
 */
export async function acknowledgeAlert(
  request: AlertAcknowledgeRequest
): Promise<void> {
  try {
    const response = await fetchWithAuth("/api/alerts/acknowledge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request),
    });
    await handleResponse(response);
  } catch (error) {
    console.error("Error acknowledging alert:", error);
    throw error;
  }
}
