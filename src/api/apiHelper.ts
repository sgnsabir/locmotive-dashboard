// src/api/apiHelper.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const isProduction = process.env.NODE_ENV === "production";

/**
 * Retrieve the JWT token from localStorage (development only).
 */
export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
}

/**
 * Save a new JWT token in localStorage (development only).
 */
export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
}

/**
 * Clear the JWT token from localStorage.
 */
export function clearToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
}

/**
 * Refresh token by calling the backend refresh endpoint.
 * In production, the backend uses HTTP‑only cookies so credentials are included automatically.
 * In development, the new token is expected in the response body and stored in localStorage.
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
        ...(!isProduction && token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(isProduction && { credentials: "include" }),
    });
    if (!response.ok) {
      console.error("Token refresh failed", { status: response.status });
      throw new Error("Failed to refresh token");
    }
    const data = await response.json();
    if (data && data.token && !isProduction) {
      setToken(data.token);
      console.info("Token refreshed successfully");
    } else if (isProduction) {
      console.info("Token refreshed via HTTP‑only cookie");
    } else {
      throw new Error("No token returned from refresh endpoint");
    }
  } catch (error) {
    console.error("Error during token refresh:", error);
    throw error;
  }
}

/**
 * A centralized fetch wrapper that automatically attaches the Authorization header (in development)
 * and handles token refresh on 401 responses.
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Create a new Headers instance based on existing headers
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  // Attach token if in development; production uses cookies so no need to attach manually
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

  // If unauthorized, attempt token refresh and retry once.
  if (response.status === 401) {
    try {
      console.warn("Received 401, attempting token refresh...");
      await refreshToken();
      // After refresh, update headers with new token (in development)
      if (!isProduction) {
        const newToken = getToken();
        if (!newToken) {
          throw new Error("Token refresh did not yield a new token");
        }
        headers.set("Authorization", `Bearer ${newToken}`);
        options.headers = headers;
      }
      response = await fetch(url, options);
      if (response.status === 401) {
        clearToken();
        window.location.href = "/login?message=Session%20expired";
        throw new Error("Session expired. Please login again.");
      }
    } catch {
      clearToken();
      window.location.href = "/login?message=Session%20expired";
      throw new Error("Session expired. Please login again.");
    }
  } else if (response.status === 403) {
    clearToken();
    window.location.href = "/403";
    throw new Error("Not Authorized");
  }
  return response;
}

/**
 * Helper function to process the fetch response.
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

export { API_BASE_URL };
