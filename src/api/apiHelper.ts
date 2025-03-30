/**
 * src/api/apiHelper.ts
 *
 * This helper file centralizes API calls.
 * All endpoints are now relative (e.g. "/api/auth/login") so that Next.js rewrites
 * (configured in next.config.ts) proxy the requests to the backend (e.g. http://localhost:8080/api/v1/…).
 */

export const API_BASE_URL = "/api"; // Use relative URLs; Next.js rewrites will proxy these calls

/**
 * Retrieve the JWT token from localStorage.
 */
export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
}

/**
 * Save a new JWT token in localStorage.
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
 * Helper function to delay execution.
 */
async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Refresh the JWT token by calling the refresh endpoint.
 * Uses the relative URL so that the Next.js rewrite forwards the request to the backend.
 */
export async function refreshToken(): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error("No token available for refresh");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include", // Include cookies if needed
    });
    if (!response.ok) {
      console.log("Failed to refresh token. Response:", response);
      clearToken();
      throw new Error("Failed to refresh token");
    }
    const data = await response.json();
    if (data.token) {
      setToken(data.token);
    } else {
      console.log("No token returned during refresh", data);
      clearToken();
      throw new Error("No token returned during refresh");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * A centralized fetch wrapper that:
 * - Attaches the authorization header if a token exists.
 * - Uses relative URLs.
 * - Uses "credentials": "include" to send cookies.
 * - Does not include an explicit "mode": "cors" option.
 * - Implements robust error handling including token refresh on 401 responses and retry on 429 (Too Many Requests).
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  // Set default headers if not already set.
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Accept", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const opts: RequestInit = {
    ...options,
    headers,
    credentials: "include", // Ensure cookies are sent when required
  };

  let response: Response;
  try {
    response = await fetch(url, opts);
  } catch (error) {
    console.log(error);
    throw new Error("Network error. Please check your connection.");
  }

  // Handle HTTP 429 Too Many Requests with retry logic.
  if (response.status === 429) {
    const maxRetries = 3;
    let retryCount = 0;
    while (retryCount < maxRetries && response.status === 429) {
      const retryAfterHeader = response.headers.get("Retry-After");
      const retryAfter = retryAfterHeader
        ? parseInt(retryAfterHeader, 10) * 1000
        : 1000;
      console.log(
        `Received HTTP 429. Retrying after ${retryAfter} ms... (Attempt ${
          retryCount + 1
        }/${maxRetries})`
      );
      await delay(retryAfter);
      retryCount++;
      try {
        response = await fetch(url, opts);
      } catch (error) {
        console.log(error);
        throw new Error(
          "Network error during retry. Please check your connection."
        );
      }
    }
    if (response.status === 429) {
      console.log(`HTTP 429 Too Many Requests after ${maxRetries} retries.`);
      throw new Error("HTTP 429 Too Many Requests");
    }
  }

  // If unauthorized, attempt token refresh and retry once.
  if (response.status === 401) {
    try {
      await refreshToken();
      const newToken = getToken();
      if (!newToken) {
        clearToken();
        throw new Error("Session expired. Please log in again.");
      }
      headers.set("Authorization", `Bearer ${newToken}`);
      response = await fetch(url, { ...opts, headers });
      if (response.status === 401) {
        clearToken();
        throw new Error("Session expired. Please log in again.");
      }
    } catch (error) {
      console.log(error);
      clearToken();
      throw new Error("Session expired. Please log in again.");
    }
  }

  return response;
}

/**
 * Process the response from a fetch call.
 * Throws an error if the response is not OK.
 */
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMsg = `HTTP error ${response.status}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch (err) {
      console.log(err);
    }
    console.log("Error in handleResponse:", errorMsg);
    throw new Error(errorMsg);
  }
  if (response.status === 204) {
    return {} as T;
  }
  return response.json();
}
