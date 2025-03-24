/**
 * src/api/auth.ts
 *
 * Handles authentication API calls using token‑based authentication.
 * The backend (built with WebFlux R2DBC) expects the JWT in the Authorization header.
 * This implementation includes robust error handling, explicit CORS settings,
 * and secure token management.
 */

import {
  LoginResponse,
  UserResponse,
  RegistrationRequest,
  ChangePasswordRequest,
  PasswordResetRequest,
} from "@/types/auth";
import { API_BASE_URL } from "@/api/apiHelper";

/**
 * Retrieves the JWT token from localStorage.
 */
export function getToken(): string | null {
  try {
    if (typeof window === "undefined") {
      throw new Error("localStorage is not available on the server.");
    }
    return localStorage.getItem("authToken");
  } catch (e) {
    console.error("Error accessing localStorage:", e);
    return null;
  }
}

/**
 * Fetches the current user information using token-based authentication.
 * The backend expects the JWT in the Authorization header.
 * This implementation uses explicit CORS settings and includes credentials.
 */
export async function getCurrentUser(): Promise<UserResponse> {
  if (typeof window === "undefined") {
    throw new Error("getCurrentUser must be called on the client side.");
  }
  const token = getToken();
  console.debug("[getCurrentUser] Retrieved token:", token);
  if (!token) {
    console.error("[getCurrentUser] No token found in localStorage.");
    throw new Error("User is not authenticated.");
  }
  if (!API_BASE_URL) {
    console.error("[getCurrentUser] API_BASE_URL is not defined.");
    throw new Error("API_BASE_URL is not configured.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      // Include credentials so that cookies (if any) are sent per backend CORS policy
      credentials: "include",
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "[getCurrentUser] Failed with status",
        response.status,
        "Response:",
        errorText
      );
      throw new Error(
        `getCurrentUser: HTTP error ${response.status} - ${errorText}`
      );
    }
    const userData: UserResponse = await response.json();
    console.debug("[getCurrentUser] Fetched user data:", userData);
    return userData;
  } catch (error) {
    console.error("Error in getCurrentUser fetch:", error);
    throw new Error(
      "Unable to fetch current user data. Please ensure the backend is running, accessible, and that CORS is properly configured."
    );
  }
}

/**
 * Logs in the user using the provided username and password.
 * On success, the JWT token is stored in localStorage.
 */
export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  console.debug("[login] Attempting login for username:", username);
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      // For token‑based auth, we omit credentials
      credentials: "omit",
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "[login] Failed with status",
        response.status,
        "Response:",
        errorText
      );
      throw new Error(`login: HTTP error ${response.status} - ${errorText}`);
    }
    const loginData: LoginResponse = await response.json();
    console.debug("[login] Received login response:", loginData);
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", loginData.token);
    }
    return loginData;
  } catch (error) {
    console.error("Error in login:", error);
    throw new Error(
      "Failed to log in. Please check your network connection and try again."
    );
  }
}

/**
 * Registers a new user.
 */
export async function register(
  registrationRequest: RegistrationRequest
): Promise<LoginResponse> {
  console.debug("[register] Registering user with data:", registrationRequest);
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "omit",
      body: JSON.stringify(registrationRequest),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "[register] Failed with status",
        response.status,
        "Response:",
        errorText
      );
      throw new Error(`register: HTTP error ${response.status} - ${errorText}`);
    }
    const data: LoginResponse = await response.json();
    console.debug("[register] Registration successful:", data);
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", data.token);
    }
    return data;
  } catch (error) {
    console.error("Error in register:", error);
    throw new Error("Failed to register user. Please try again.");
  }
}

/**
 * Changes the user's password.
 */
export async function changePassword(
  changePasswordRequest: ChangePasswordRequest
): Promise<string> {
  const token = getToken();
  if (!token) {
    console.error("[changePassword] No token found.");
    throw new Error("User is not authenticated.");
  }
  console.debug(
    "[changePassword] Changing password with request:",
    changePasswordRequest
  );
  try {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "omit",
      body: JSON.stringify(changePasswordRequest),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "[changePassword] Failed with status",
        response.status,
        "Response:",
        errorText
      );
      throw new Error(
        `changePassword: HTTP error ${response.status} - ${errorText}`
      );
    }
    const data = await response.json();
    console.debug("[changePassword] Password changed successfully:", data);
    return data.message;
  } catch (error) {
    console.error("Error in changePassword:", error);
    throw new Error("Failed to change password. Please try again.");
  }
}

/**
 * Resets the user's password.
 */
export async function resetPassword(
  passwordResetRequest: PasswordResetRequest
): Promise<string> {
  console.debug(
    "[resetPassword] Resetting password with request:",
    passwordResetRequest
  );
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "omit",
      body: JSON.stringify(passwordResetRequest),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "[resetPassword] Failed with status",
        response.status,
        "Response:",
        errorText
      );
      throw new Error(
        `resetPassword: HTTP error ${response.status} - ${errorText}`
      );
    }
    const data = await response.json();
    console.debug("[resetPassword] Password reset successful:", data);
    return data.message;
  } catch (error) {
    console.error("Error in resetPassword:", error);
    throw new Error("Failed to reset password. Please try again.");
  }
}

/**
 * Logs out the current user.
 */
export async function logout(): Promise<void> {
  const token = getToken();
  console.debug("[logout] Logging out. Token:", token);
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "omit",
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "[logout] Failed with status",
        response.status,
        "Response:",
        errorText
      );
      throw new Error(`logout: HTTP error ${response.status} - ${errorText}`);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
    console.debug("[logout] Logout successful.");
  } catch (error) {
    console.error("Error in logout:", error);
    throw new Error("Failed to logout. Please try again.");
  }
}
