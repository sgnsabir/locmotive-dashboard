// src/api/auth.ts
import { LoginResponse, RegistrationRequest, UserResponse } from "@/types/auth";
import { getToken, handleResponse, API_BASE_URL } from "./apiHelper";

export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include", // Ensure cookies (if used) are included
  });
  return handleResponse<LoginResponse>(response);
}

export async function register(
  registrationRequest: RegistrationRequest
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registrationRequest),
    credentials: "include",
  });
  return handleResponse<LoginResponse>(response);
}

export async function logout(): Promise<void> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
    credentials: "include",
  });
  if (!response.ok) {
    await handleResponse(response);
  }
  localStorage.removeItem("authToken");
}

export async function getCurrentUser(): Promise<UserResponse> {
  const token = getToken();
  const requestOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    credentials: "include", // Include cookies to support HTTP‑only authentication
  };

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, requestOptions);
    return await handleResponse<UserResponse>(response);
  } catch (error) {
    console.error("getCurrentUser: Unable to fetch current user.", error);
    throw new Error("getCurrentUser: Unable to fetch current user. " + error);
  }
}

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<string> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({
      oldPassword,
      newPassword,
      confirmNewPassword: newPassword,
    }),
    credentials: "include",
  });
  return handleResponse<string>(response);
}

export async function resetPassword(
  email: string,
  newPassword: string
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword }),
    credentials: "include",
  });
  return handleResponse<string>(response);
}
