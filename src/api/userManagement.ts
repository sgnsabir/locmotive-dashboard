import {
  AdminDashboardDTO,
  UserResponse,
  UserUpdateRequest,
} from "@/types/auth";
import { getToken, handleResponse, API_BASE_URL } from "./apiHelper";

export async function getUserById(id: number): Promise<UserResponse> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse<UserResponse>(response);
}

export async function getAllUsers(): Promise<UserResponse[]> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse<UserResponse[]>(response);
}

export async function updateUser(
  id: number,
  updateRequest: UserUpdateRequest
): Promise<UserResponse> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(updateRequest),
  });
  return handleResponse<UserResponse>(response);
}

export async function deleteUser(id: number): Promise<void> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  await handleResponse(response);
}

export async function getAdminDashboard(): Promise<AdminDashboardDTO> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return handleResponse<AdminDashboardDTO>(response);
}
