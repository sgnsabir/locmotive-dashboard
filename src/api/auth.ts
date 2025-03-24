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
    return typeof window !== "undefined"
      ? localStorage.getItem("authToken")
      : null;
  } catch (e) {
    console.error("Error accessing localStorage:", e);
    return null;
  }
}

/**
 * Fetches the current user information using token-based authentication.
 * The backend (built with WebFlux R2DBC) expects the JWT in the Authorization header
 * and does not rely on cookies. Therefore, credentials are omitted.
 */
export async function getCurrentUser(): Promise<UserResponse> {
  const token = getToken();
  console.debug("[getCurrentUser] Retrieved token:", token);
  if (!token) {
    console.error("[getCurrentUser] No token found in localStorage.");
    throw new Error("User is not authenticated.");
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "omit", // omit credentials since backend uses bearer tokens
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      "[getCurrentUser] Failed with status",
      response.status,
      "Response:",
      errorText
    );
    throw new Error(`getCurrentUser: HTTP error ${response.status}`);
  }
  const userData: UserResponse = await response.json();
  console.debug("[getCurrentUser] Fetched user data:", userData);
  return userData;
}

/**
 * Logs in the user using the provided username and password.
 * On success, the JWT token is stored in localStorage.
 * Since the backend uses token-based authentication, credentials are omitted.
 */
export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  console.debug("[login] Attempting login for username:", username);
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "omit", // omit credentials to avoid CORS issues
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
    throw new Error(`login: HTTP error ${response.status}`);
  }
  const loginData: LoginResponse = await response.json();
  console.debug("[login] Received login response:", loginData);
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", loginData.token);
  }
  return loginData;
}

/**
 * Registers a new user.
 */
export async function register(
  registrationRequest: RegistrationRequest
): Promise<LoginResponse> {
  console.debug("[register] Registering user with data:", registrationRequest);
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "omit", // omit credentials for token-based registration
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
    throw new Error(`register: HTTP error ${response.status}`);
  }
  const data: LoginResponse = await response.json();
  console.debug("[register] Registration successful:", data);
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", data.token);
  }
  return data;
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
  const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "omit", // omit credentials for token-based auth
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
    throw new Error(`changePassword: HTTP error ${response.status}`);
  }
  const data = await response.json();
  console.debug("[changePassword] Password changed successfully:", data);
  return data.message;
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
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "omit", // omit credentials for token-based auth
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
    throw new Error(`resetPassword: HTTP error ${response.status}`);
  }
  const data = await response.json();
  console.debug("[resetPassword] Password reset successful:", data);
  return data.message;
}

/**
 * Logs out the current user.
 */
export async function logout(): Promise<void> {
  const token = getToken();
  console.debug("[logout] Logging out. Token:", token);
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "omit", // omit credentials for token-based logout
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      "[logout] Failed with status",
      response.status,
      "Response:",
      errorText
    );
    throw new Error(`logout: HTTP error ${response.status}`);
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
  console.debug("[logout] Logout successful.");
}
