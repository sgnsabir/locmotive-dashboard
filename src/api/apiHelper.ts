/// <reference types="node" />

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Retrieve the JWT token from localStorage if available.
 * Safe for use in SSR by checking for window.
 */
export function getToken(): string | null {
  try {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
  } catch (err) {
    console.error("Error getting token from localStorage:", err);
  }
  return null;
}

/**
 * Save a JWT token to localStorage.
 */
export function setToken(token: string): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
    }
  } catch (err) {
    console.error("Error setting token in localStorage:", err);
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
  } catch (err) {
    console.error("Error clearing token from localStorage:", err);
  }
}

/**
 * Handles the response from a fetch call.
 * If the response is not OK, it attempts to parse an error message from JSON (if available) then throws.
 */
export async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  let responseBody: unknown;
  if (contentType && contentType.includes("application/json")) {
    responseBody = await response.json();
  } else {
    responseBody = await response.text();
  }
  if (!response.ok) {
    const errorMsg =
      (responseBody &&
        typeof responseBody === "object" &&
        (responseBody as { message?: string }).message) ||
      responseBody ||
      response.statusText;
    console.error(`HTTP error ${response.status}:`, errorMsg, {
      status: response.status,
      url: response.url,
    });
    throw new Error(errorMsg as string);
  }
  // For a 204 (No Content), return an empty object cast as T.
  if (response.status === 204) {
    return {} as T;
  }
  return responseBody as T;
}

/**
 * A centralized fetch wrapper that automatically includes the Authorization header,
 * sets proper CORS mode and credentials, and handles network errors.
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Use credentials: "include" to allow cookies (and other credentials) in cross-origin requests.
  const token = getToken();
  const defaultOptions: RequestInit = {
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  // If a token exists, attach it to the Authorization header.
  if (token) {
    (defaultOptions.headers as Record<string, string>)[
      "Authorization"
    ] = `Bearer ${token}`;
  }

  // Merge provided options with defaults (merging headers too).
  const mergedOptions: RequestInit = {
    ...defaultOptions,
    ...options,
    headers: {
      ...(defaultOptions.headers as Record<string, string>),
      ...(options.headers || {}),
    },
  };

  // Ensure that the API_BASE_URL is configured.
  if (!API_BASE_URL) {
    throw new Error(
      "API_BASE_URL is not configured. Please check your environment variables."
    );
  }

  try {
    const response = await fetch(url, mergedOptions);

    // Handle unauthorized access by clearing token and redirecting.
    if (response.status === 401) {
      clearToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login?message=Session%20expired";
      }
      throw new Error("Session expired. Please login again.");
    }
    if (response.status === 403) {
      clearToken();
      if (typeof window !== "undefined") {
        window.location.href = "/403";
      }
      throw new Error("Not authorized.");
    }
    return response;
  } catch (error: unknown) {
    console.error("Network error during fetchWithAuth:", error, {
      url,
      options: mergedOptions,
    });
    throw new Error(
      `Network error. Please check your connection and try again. URL: ${url}`
    );
  }
}

/**
 * Centralized API fetch helper that builds the full URL using API_BASE_URL,
 * calls fetchWithAuth with the given options, and processes the response.
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured.");
  }
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetchWithAuth(url, options);
  return handleResponse<T>(response);
}
