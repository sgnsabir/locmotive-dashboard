import { API_BASE_URL, getToken, handleResponse } from "@/api/apiHelper";
import type { DashboardWidget } from "./WidgetCard";

/**
 * Loads the user's dashboard widget configuration from the backend.
 * Expects the backend GET /users/settings endpoint to return a JSON object with a "dashboardWidgets" property.
 *
 * @returns A Promise that resolves to an array of DashboardWidget.
 */
export async function loadWidgets(): Promise<DashboardWidget[]> {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/users/settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: process.env.NODE_ENV === "production" ? "include" : "omit",
    });
    // Assuming backend returns an object: { dashboardWidgets: DashboardWidget[] }
    const data = await handleResponse<{ dashboardWidgets: DashboardWidget[] }>(
      response
    );
    return data.dashboardWidgets || [];
  } catch (err) {
    console.error("Error loading widget configuration from backend:", err);
    return [];
  }
}

/**
 * Saves the user's dashboard widget configuration to the backend.
 * Sends a PUT request to the backend /users/settings endpoint with the updated configuration.
 *
 * @param widgets - The updated array of DashboardWidget to persist.
 * @returns A Promise that resolves when the update is complete.
 */
export async function saveWidgets(widgets: DashboardWidget[]): Promise<void> {
  try {
    const token = getToken();
    const payload = { dashboardWidgets: widgets };
    const response = await fetch(`${API_BASE_URL}/users/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: process.env.NODE_ENV === "production" ? "include" : "omit",
      body: JSON.stringify(payload),
    });
    await handleResponse(response);
  } catch (err) {
    console.error("Error saving widget configuration to backend:", err);
    throw err;
  }
}
