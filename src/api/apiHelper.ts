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
    console.debug("[setToken] New token saved to localStorage.");
  }
}

/**
 * Clear the JWT token from localStorage.
 */
export function clearToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    console.debug("[clearToken] Token removed from localStorage.");
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
    console.error("[refreshToken] No token available for refresh.");
    throw new Error("No token available for refresh");
  }
  try {
    console.debug(
      "[refreshToken] Attempting to refresh token using URL:",
      `${API_BASE_URL}/auth/refresh`
    );
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(!isProduction && token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(isProduction && { credentials: "include" }),
    });
    console.debug(
      "[refreshToken] Received response with status:",
      response.status
    );
    if (!response.ok) {
      console.error("[refreshToken] Token refresh failed", {
        status: response.status,
      });
      throw new Error("Failed to refresh token");
    }
    const data = await response.json();
    console.debug("[refreshToken] Response data:", data);
    if (data && data.token && !isProduction) {
      setToken(data.token);
      console.info(
        "[refreshToken] Token refreshed successfully (development)."
      );
    } else if (isProduction) {
      console.info(
        "[refreshToken] Token refreshed via HTTP‑only cookie (production)."
      );
    } else {
      console.error("[refreshToken] No token returned from refresh endpoint.");
      throw new Error("No token returned from refresh endpoint");
    }
  } catch (error) {
    console.error("[refreshToken] Error during token refresh:", error);
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
  console.debug("[fetchWithAuth] Initiating fetch for URL:", url);

  // Create a new Headers instance based on existing headers
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json"); // Ensure JSON response

  // Attach token if in development; production uses cookies so no need to attach manually
  if (!isProduction) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
      console.debug("[fetchWithAuth] Attached token to headers.");
    } else {
      console.warn("[fetchWithAuth] No token found in localStorage.");
    }
  }
  options.headers = headers;
  options.mode = "cors"; // Explicitly set CORS mode

  if (isProduction) {
    options.credentials = "include";
  }

  let response: Response;
  try {
    console.debug("[fetchWithAuth] Fetch options:", options);
    response = await fetch(url, options);
    console.debug(
      "[fetchWithAuth] Received response with status:",
      response.status
    );
  } catch (networkError) {
    console.error("[fetchWithAuth] Network error during fetch:", networkError);
    throw new Error("Network error. Please check your connection.");
  }

  // If unauthorized, attempt token refresh and retry once.
  if (response.status === 401) {
    console.warn(
      "[fetchWithAuth] Received 401 Unauthorized. Attempting token refresh..."
    );
    try {
      await refreshToken();
      // After refresh, update headers with new token (in development)
      if (!isProduction) {
        const newToken = getToken();
        if (!newToken) {
          console.error(
            "[fetchWithAuth] Token refresh did not yield a new token."
          );
          throw new Error("Token refresh did not yield a new token");
        }
        headers.set("Authorization", `Bearer ${newToken}`);
        options.headers = headers;
        console.debug(
          "[fetchWithAuth] Updated headers with new token after refresh."
        );
      }
      response = await fetch(url, options);
      console.debug(
        "[fetchWithAuth] Retried fetch received status:",
        response.status
      );
      if (response.status === 401) {
        clearToken();
        window.location.href = "/login?message=Session%20expired";
        throw new Error("Session expired. Please login again.");
      }
    } catch (error) {
      console.error("[fetchWithAuth] Token refresh or retry failed:", error);
      clearToken();
      window.location.href = "/login?message=Session%20expired";
      throw new Error("Session expired. Please login again.");
    }
  } else if (response.status === 403) {
    console.error("[fetchWithAuth] Received 403 Forbidden.");
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
  console.debug("[handleResponse] Processing response from URL:", response.url);
  if (!response.ok) {
    let errorMsg = `HTTP error ${response.status}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
      console.error("[handleResponse] Error response data:", errorData);
    } catch (err) {
      console.error("[handleResponse] Error parsing error response:", err);
    }
    console.error("[handleResponse] API call failed:", errorMsg, {
      status: response.status,
      url: response.url,
    });
    throw new Error(errorMsg);
  }
  if (response.status === 204) {
    console.debug("[handleResponse] No content (204) received.");
    return {} as T;
  }
  const jsonData = await response.json();
  console.debug("[handleResponse] Successful response data:", jsonData);
  return jsonData as Promise<T>;
}

export { API_BASE_URL };
