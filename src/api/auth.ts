// src/api/auth.ts
import {
  LoginResponse,
  UserResponse,
  RegistrationRequest,
  ChangePasswordRequest,
  PasswordResetRequest,
} from "@/types/auth";
import { API_BASE_URL, getToken, setToken, clearToken } from "@/api/apiHelper";

/**
 * Retrieves the current user information using token‑based authentication.
 * This function uses our centralized apiFetch helper which applies proper CORS, credentials,
 * and error handling. It is intended to be called only on the client side.
 */
export async function getCurrentUser(): Promise<UserResponse> {
  if (typeof window === "undefined") {
    throw new Error("getCurrentUser must be called on the client side.");
  }

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
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "omit",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Get current user failed with status:",
        response.status,
        "Error:",
        errorText
      );
      throw new Error(
        `getCurrentUser: HTTP error ${response.status} - ${errorText}`
      );
    }

    const userData = await response.json();
    console.log("Successfully retrieved user data");
    return userData;
  } catch (error) {
    console.error("Error getting current user:", error);
    // If we get a 401 or 403, clear the token as it's invalid
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
 * Logs in the user using the provided username and password.
 * On success, stores the JWT token for subsequent calls.
 */
export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  try {
    console.log("Attempting login with username:", username);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "omit",
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Login failed with status:",
        response.status,
        "Error:",
        errorText
      );
      throw new Error(`login: HTTP error ${response.status} - ${errorText}`);
    }

    const loginData: LoginResponse = await response.json();
    console.log(
      "Login successful, received token:",
      loginData.token ? "Token present" : "No token"
    );

    // Store token securely for subsequent API calls
    if (loginData.token) {
      setToken(loginData.token);
      // Verify token is set by trying to get it
      const storedToken = getToken();
      if (!storedToken) {
        console.error("Failed to store token in localStorage");
        throw new Error("Failed to store authentication token");
      }
      console.log("Token successfully stored in localStorage");
    } else {
      console.error("No token received in login response");
      throw new Error("No token received from login response");
    }

    return loginData;
  } catch (error) {
    console.error("Error in login:", error);
    // Clear any partial token if login failed
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
      throw new Error(`register: HTTP error ${response.status} - ${errorText}`);
    }
    const data: LoginResponse = await response.json();
    setToken(data.token);
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
    throw new Error("User is not authenticated.");
  }
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
      throw new Error(
        `changePassword: HTTP error ${response.status} - ${errorText}`
      );
    }
    const data = await response.json();
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
      throw new Error(
        `resetPassword: HTTP error ${response.status} - ${errorText}`
      );
    }
    const data = await response.json();
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
      throw new Error(`logout: HTTP error ${response.status} - ${errorText}`);
    }
    clearToken();
  } catch (error) {
    console.error("Error in logout:", error);
    throw new Error("Failed to logout. Please try again.");
  }
}
