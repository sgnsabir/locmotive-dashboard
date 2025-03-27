// src/api/auth.ts

import {
  API_BASE_URL,
  getToken,
  setToken,
  clearToken,
  fetchWithAuth,
  handleResponse,
} from "@/api/apiHelper";
import {
  UserResponse,
  LoginResponse,
  RegistrationRequest,
  ChangePasswordRequest,
  PasswordResetRequest,
} from "@/types/user";
/**
 * Retrieves the current user from the backend.
 * Uses fetchWithAuth to ensure credentials are sent.
 */
export async function getCurrentUser(): Promise<UserResponse> {
  const token = getToken();
  if (!token) {
    console.error("No token found when trying to get current user");
    throw new Error("User is not authenticated. Please log in first.");
  }
  try {
    console.log(
      "Fetching current user with token:",
      token ? "Token present" : "No token"
    );
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/me`, {
      method: "GET",
    });
    // handleResponse will throw if not OK
    const userData: UserResponse = await handleResponse<UserResponse>(response);
    console.log("Successfully retrieved user data");
    return userData;
  } catch (error: unknown) {
    console.error("Error getting current user:", error);
    if (
      error instanceof Error &&
      (error.message.includes("401") || error.message.includes("403"))
    ) {
      console.log("Clearing invalid token");
      clearToken();
      throw new Error("Session expired. Please log in again.");
    }
    throw error;
  }
}

/**
 * Logs in a user with the given username and password.
 * Uses fetchWithAuth for consistent credential handling.
 */
export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured.");
  }
  try {
    console.log("Attempting login with username:", username);
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    // Process response via handleResponse to catch errors.
    const loginData: LoginResponse = await handleResponse<LoginResponse>(
      response
    );
    console.log(
      "Login successful, token received:",
      loginData.token ? "Yes" : "No"
    );
    if (loginData.token) {
      setToken(loginData.token);
    } else {
      console.error("No token received in login response");
      throw new Error("No token received from login response");
    }
    return loginData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in login:", error.message);
    } else {
      console.error("Error in login:", error);
    }
    clearToken();
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
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify(registrationRequest),
    });
    const data: LoginResponse = await handleResponse<LoginResponse>(response);
    setToken(data.token);
    return data;
  } catch (error: unknown) {
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
    throw new Error("User is not authenticated.");
  }
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/auth/change-password`,
      {
        method: "POST",
        body: JSON.stringify(changePasswordRequest),
      }
    );
    const data = await handleResponse<{ message: string }>(response);
    return data.message;
  } catch (error: unknown) {
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
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/auth/reset-password`,
      {
        method: "POST",
        body: JSON.stringify(passwordResetRequest),
      }
    );
    const data = await handleResponse<{ message: string }>(response);
    return data.message;
  } catch (error: unknown) {
    console.error("Error in resetPassword:", error);
    throw new Error("Failed to reset password. Please try again.");
  }
}

/**
 * Logs out the user.
 */
export async function logout(): Promise<void> {
  const token = getToken();
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    await handleResponse(response);
    clearToken();
  } catch (error: unknown) {
    console.error("Error in logout:", error);
    throw new Error("Failed to logout. Please try again.");
  }
}
