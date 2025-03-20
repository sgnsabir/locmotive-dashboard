// src/api/alerts.ts

import { AlertAcknowledgeRequest, AlertResponse } from "@/types/alert";
import { apiFetch } from "./apiHelper";

/**
 * Fetch all alerts from the backend.
 *
 * @returns A promise resolving to an array of AlertResponse objects.
 */
export async function getAlerts(): Promise<AlertResponse[]> {
  return apiFetch<AlertResponse[]>("/alerts");
}

/**
 * Acknowledge a specific alert by its ID.
 *
 * @param request - An object containing the alertId to acknowledge.
 * @returns A promise that resolves when the alert is acknowledged.
 */
export async function acknowledgeAlert(
  request: AlertAcknowledgeRequest
): Promise<void> {
  await apiFetch<void>("/alerts/acknowledge", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

/**
 * Fetch details of a single alert by its ID.
 *
 * @param alertId - The ID of the alert to retrieve.
 * @returns A promise resolving to an AlertResponse object.
 */
export async function getAlertById(alertId: number): Promise<AlertResponse> {
  return apiFetch<AlertResponse>(`/alerts/${alertId}`);
}
