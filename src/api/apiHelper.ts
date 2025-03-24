// src/api/apiHelper.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Retrieve the JWT token from localStorage if available.
 * Safe for use in SSR by checking for window.
 */
export function getToken(): string | null {
  try {
    return typeof window !== "undefined"
      ? localStorage.getItem("authToken")
      : null;
  } catch (e) {
    console.error("Error accessing localStorage:", e);
    return null;
  }
}

/**
 * Save a JWT token to localStorage.
 */
export function setToken(token: string): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
    }
  } catch (e) {
    console.error("Error saving token to localStorage:", e);
  }
}

/**
 * Clear the JWT token from localStorage.
 */
export function clearToken(): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
  } catch (e) {
    console.error("Error clearing token from localStorage:", e);
  }
}

/**
 * Handles the response from a fetch call.
 * If not OK, extracts and logs an error message then throws.
 */
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMsg = `HTTP error ${response.status}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch (err) {
      console.error("Error parsing error response:", err);
    }
    console.error("API call failed:", errorMsg, {
      status: response.status,
      url: response.url,
    });
    throw new Error(errorMsg);
  }
  if (response.status === 204) {
    return {} as T;
  }
  return response.json() as Promise<T>;
}

/**
 * A centralized fetch wrapper that automatically includes the Authorization header,
 * proper CORS and credentials options, and robust error handling.
 */
export async function fetchWithAuth(
  url: string,
  options?: RequestInit
): Promise<Response> {
  options = options || {};
  // Ensure cross-origin requests and that cookies (or HTTP‑only tokens) are sent
  options.mode = "cors";
  options.credentials = "include";

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  options.headers = headers;

  let response: Response;
  try {
    response = await fetch(url, options);
  } catch (networkError) {
    console.error("Network error during fetch:", networkError);
    throw new Error("Network error. Please check your connection.");
  }

  // Handle unauthorized access by redirecting the user
  if (response.status === 401) {
    clearToken();
    window.location.href = "/login?message=Session%20expired";
    throw new Error("Session expired. Please login again.");
  }
  if (response.status === 403) {
    clearToken();
    window.location.href = "/403";
    throw new Error("Not authorized.");
  }
  return response;
}

/**
 * A helper function to perform fetch calls with automatic auth handling and error processing.
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetchWithAuth(url, options);
  return handleResponse<T>(response);
}

export { API_BASE_URL };
