// src/api/maintenance.ts

import { fetchWithAuth, handleResponse } from "@/api/apiHelper";
import {
  MaintenanceRecord,
  PredictiveMaintenanceResponse,
} from "@/types/maintenance";

/**
 * Retrieves the maintenance schedule from the backend.
 * Endpoint: GET /api/maintenance/schedule
 */
export async function getMaintenanceSchedule(): Promise<MaintenanceRecord[]> {
  try {
    const response = await fetchWithAuth("/api/maintenance/schedule", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // Note: credentials and retry logic (e.g., for HTTP 429) are handled in fetchWithAuth.
    });
    return await handleResponse<MaintenanceRecord[]>(response);
  } catch (error: unknown) {
    console.error("Error fetching maintenance schedule:", error);
    throw error;
  }
}

/**
 * Retrieves predictive maintenance insights for a given analysisId and alertEmail.
 * Endpoint: GET /api/predictive/{analysisId}?alertEmail={email}
 *
 * @param analysisId - The analysis identifier.
 * @param alertEmail - The email to use for alerts (default: alerts@example.com).
 */
export async function getPredictiveMaintenance(
  analysisId: number,
  alertEmail: string = "sgnsabir@gmail.com"
): Promise<PredictiveMaintenanceResponse> {
  try {
    const url = `/api/predictive/${analysisId}?alertEmail=${encodeURIComponent(
      alertEmail
    )}`;
    const response = await fetchWithAuth(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<PredictiveMaintenanceResponse>(response);
  } catch (error: unknown) {
    console.error("Error fetching predictive maintenance data:", error);
    throw error;
  }
}
