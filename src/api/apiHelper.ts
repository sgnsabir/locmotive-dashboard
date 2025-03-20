const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const isProduction = process.env.NODE_ENV === "production";

/**
 * Retrieve the JWT token from storage.
 * In production, JWTs are stored in HTTP‑only cookies so this function returns null.
 */
export function getToken(): string | null {
  return isProduction ? null : localStorage.getItem("authToken");
}

/**
 * Save a new JWT token in storage.
 * Only used in development; in production tokens are managed via secure HTTP‑only cookies.
 */
function setToken(token: string): void {
  if (!isProduction) {
    localStorage.setItem("authToken", token);
  }
}

/**
 * Clear the JWT token from storage.
 * Only used in development.
 */
function clearToken(): void {
  if (!isProduction) {
    localStorage.removeItem("authToken");
  }
}

/**
 * Global error handler for API responses.
 * Checks if the response status is non‑2xx, tries to extract an error message from the body,
 * logs detailed error information and then throws a standardized Error.
 *
 * @param response - the Response object from fetch
 * @returns Parsed JSON data if response is OK, otherwise throws an Error.
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
 * Refresh token by calling the backend refresh endpoint.
 * In production, the backend sets the new token as an HTTP‑only cookie.
 * In development, the new token is stored in localStorage.
 *
 * @returns A Promise that resolves when the token is successfully refreshed.
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
        // In development, send token; in production, cookie is used automatically.
        ...(isProduction ? {} : { Authorization: `Bearer ${token}` }),
      },
      // In production, include credentials so cookies are sent and received.
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
 * A centralized fetch wrapper that automatically includes the Authorization header
 * in development. In production, it relies on cookies (via credentials: "include").
 * If the API call returns a 401 (unauthorized) or 403 (forbidden), it handles the response as follows:
 * - For 401: attempts a token refresh; on failure, clears any stored token and redirects to /login with a “Session expired” message.
 * - For 403: immediately redirects to /403 (Not Authorized).
 *
 * @param url - The full URL for the API call.
 * @param options - Optional RequestInit options.
 * @returns The fetch Response.
 */
export async function fetchWithAuth(
  url: string,
  options?: RequestInit
): Promise<Response> {
  if (!options) {
    options = {};
  }
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  // In development, attach token from localStorage; in production, cookies are used.
  if (!isProduction) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  options.headers = headers;

  // In production, include credentials so that HTTP‑only cookies are sent automatically.
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

  if (response.status === 403) {
    clearToken();
    window.location.href = "/403";
    throw new Error("Not Authorized");
  }

  if (response.status === 401) {
    try {
      await refreshToken();
      // In development, get updated token; in production, cookie is refreshed.
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
  }
  return response;
}

/**
 * A helper function to perform a fetch call with automatic auth handling and error processing.
 *
 * @param endpoint - API endpoint path (appended to API_BASE_URL)
 * @param options - RequestInit options (optional)
 * @returns A Promise resolving to the parsed JSON response of type T.
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
