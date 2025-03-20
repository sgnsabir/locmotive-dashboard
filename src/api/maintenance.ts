// src/api/maintenance.ts
import {
  MaintenanceRecord,
  PredictiveMaintenanceResponse,
} from "@/types/maintenance";
import { getToken, handleResponse, API_BASE_URL } from "./apiHelper";

/**
 * Retrieves the maintenance schedule from the backend.
 * Assumes that the backend exposes GET /maintenance/schedule.
 *
 * @returns a Promise resolving to an array of MaintenanceRecord.
 */
export async function getMaintenanceSchedule(): Promise<MaintenanceRecord[]> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/maintenance/schedule`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return handleResponse<MaintenanceRecord[]>(response);
}

/**
 * Retrieves predictive maintenance insights for a given analysisId and alertEmail.
 *
 * @param analysisId - The identifier for the analysis.
 * @param alertEmail - The email to use for alerts (default: alerts@example.com).
 * @returns a Promise resolving to a PredictiveMaintenanceResponse.
 */
export async function getPredictiveMaintenance(
  analysisId: number,
  alertEmail: string = "alerts@example.com"
): Promise<PredictiveMaintenanceResponse> {
  const token = getToken();
  const url = `${API_BASE_URL}/predictive/${analysisId}?alertEmail=${encodeURIComponent(
    alertEmail
  )}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return handleResponse<PredictiveMaintenanceResponse>(response);
}
