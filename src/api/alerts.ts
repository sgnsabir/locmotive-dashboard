// src/api/alerts.ts

import { AlertAcknowledgeRequest, AlertResponse } from "@/types/alert";
import { fetchWithAuth, API_BASE_URL } from "./apiHelper";

/**
 * Helper function to retry an asynchronous operation with exponential backoff.
 *
 * @param operation The async function to retry.
 * @param retries Number of retries.
 * @param delay Initial delay in milliseconds.
 * @returns The resolved value of the operation.
 */
async function retryOperation<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) {
      console.error("Operation failed after all retries:", error);
      throw error;
    }
    console.warn(
      `Operation error: ${error}. Retrying in ${delay} ms (${retries} retries left)`
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryOperation(operation, retries - 1, delay * 2);
  }
}

/**
 * Fetch all alerts from the backend.
 *
 * @returns A promise resolving to an array of AlertResponse objects.
 */
export async function getAlerts(): Promise<AlertResponse[]> {
  try {
    const response = await retryOperation(() =>
      fetchWithAuth(`${API_BASE_URL}/alerts`)
    );
    if (!response.ok) {
      console.error(
        "Failed to fetch alerts:",
        response.status,
        response.statusText
      );
      throw new Error(
        `Failed to fetch alerts: ${response.status} ${response.statusText}`
      );
    }
    const data: AlertResponse[] = await response.json();
    console.info("Successfully fetched alerts:", data);
    return data;
  } catch (error) {
    console.error("Error in getAlerts:", error);
    throw error;
  }
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
  try {
    const response = await retryOperation(() =>
      fetchWithAuth(`${API_BASE_URL}/alerts/acknowledge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      })
    );
    if (!response.ok) {
      console.error(
        "Failed to acknowledge alert:",
        response.status,
        response.statusText
      );
      throw new Error(
        `Failed to acknowledge alert: ${response.status} ${response.statusText}`
      );
    }
    console.info("Alert acknowledged successfully");
  } catch (error) {
    console.error("Error in acknowledgeAlert:", error);
    throw error;
  }
}

/**
 * Fetch details of a single alert by its ID.
 *
 * @param alertId - The ID of the alert to retrieve.
 * @returns A promise resolving to an AlertResponse object.
 */
export async function getAlertById(alertId: number): Promise<AlertResponse> {
  try {
    const response = await retryOperation(() =>
      fetchWithAuth(`${API_BASE_URL}/alerts/${alertId}`)
    );
    if (!response.ok) {
      console.error(
        `Failed to fetch alert ${alertId}:`,
        response.status,
        response.statusText
      );
      throw new Error(
        `Failed to fetch alert ${alertId}: ${response.status} ${response.statusText}`
      );
    }
    const data: AlertResponse = await response.json();
    console.info(`Successfully fetched alert ${alertId}:`, data);
    return data;
  } catch (error) {
    console.error(`Error in getAlertById for alert ${alertId}:`, error);
    throw error;
  }
}
