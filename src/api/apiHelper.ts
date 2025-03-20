// src/api/apiHelper.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const isProduction = process.env.NODE_ENV === "production";

/**
 * Retrieve the JWT token from storage.
 * In production, tokens are managed via HTTP‑only cookies.
 */
export function getToken(): string | null {
  return isProduction ? null : localStorage.getItem("authToken");
}

/**
 * Global error handler for API responses.
 * Throws an Error with a descriptive message if the response is not ok.
 */
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMsg = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch (e) {
      console.error("Error parsing error response:", e);
    }
    throw new Error(errorMsg);
  }
  if (response.status === 204) {
    return {} as T;
  }
  return response.json() as Promise<T>;
}

/**
 * Refresh the JWT token.
 * In production, the new token is set automatically via HTTP‑only cookies.
 */
export async function refreshToken(): Promise<void> {
  const token = getToken();
  if (!token && !isProduction) {
    throw new Error("No token available for refresh");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(isProduction ? {} : { Authorization: `Bearer ${token}` }),
      },
      ...(isProduction ? { credentials: "include" } : {}),
    });
    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }
    const data = await response.json();
    if (data && data.token && !isProduction) {
      localStorage.setItem("authToken", data.token);
    }
  } catch (error) {
    console.error("Error during token refresh:", error);
    throw error;
  }
}

/**
 * A centralized fetch wrapper that includes authentication headers,
 * handles token refresh on 401 responses, and throws on 403 responses.
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (!isProduction) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  options.headers = headers;

  if (isProduction) {
    options.credentials = "include";
  }

  let response: Response;
  try {
    response = await fetch(url, options);
  } catch (networkError) {
    console.error("Network error during fetch:", networkError);
    throw new Error("Network error. Please check your connection.");
  }

  if (response.status === 401) {
    try {
      await refreshToken();
      const newToken = getToken();
      if (newToken) {
        headers.set("Authorization", `Bearer ${newToken}`);
        options.headers = headers;
        response = await fetch(url, options);
      } else {
        throw new Error("Token refresh did not yield a new token");
      }
    } catch {
      throw new Error("Session expired. Please login again.");
    }
  }

  if (response.status === 403) {
    throw new Error("Not Authorized");
  }
  return response;
}

/**
 * Helper function to perform an API fetch call that automatically
 * includes the base URL and handles authentication.
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetchWithAuth(url, options);
  return handleResponse<T>(response);
}

/**
 * Send a verification code by calling the dedicated backend endpoint.
 * This function triggers the backend to send a verification code
 * to the user (e.g., via email or SMS).
 */
export async function sendVerificationCode(): Promise<{ message: string }> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/auth/send-verification-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(isProduction ? { credentials: "include" } : {}),
  });
  return handleResponse<{ message: string }>(response);
}

export { API_BASE_URL };
