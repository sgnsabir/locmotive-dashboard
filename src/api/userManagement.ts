// src/api/userManagement.ts
import {
  UserResponse,
  UserUpdateRequest,
  AdminDashboardDTO,
} from "@/types/user";
import { fetchWithAuth, handleResponse } from "./apiHelper";

/**
 * Retrieves a user by their ID.
 */
export async function getUserById(id: number): Promise<UserResponse> {
  try {
    const response = await fetchWithAuth(`/api/users/${id}`, {
      method: "GET",
      credentials: "include",
    });
    return await handleResponse<UserResponse>(response);
  } catch (error: unknown) {
    console.error("Error fetching user by id:", error);
    throw error;
  }
}

/**
 * Retrieves all users.
 */
export async function getAllUsers(): Promise<UserResponse[]> {
  try {
    const response = await fetchWithAuth("/api/users", {
      method: "GET",
      credentials: "include",
    });
    return await handleResponse<UserResponse[]>(response);
  } catch (error: unknown) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}

/**
 * Updates a user with the given ID.
 */
export async function updateUser(
  id: number,
  updateRequest: UserUpdateRequest
): Promise<UserResponse> {
  try {
    const response = await fetchWithAuth(`/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updateRequest),
    });
    return await handleResponse<UserResponse>(response);
  } catch (error: unknown) {
    console.error("Error updating user:", error);
    throw error;
  }
}

/**
 * Deletes the user with the given ID.
 */
export async function deleteUser(id: number): Promise<void> {
  try {
    const response = await fetchWithAuth(`/api/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    await handleResponse(response);
  } catch (error: unknown) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

/**
 * Retrieves the admin dashboard data.
 */
export async function getAdminDashboard(): Promise<AdminDashboardDTO> {
  try {
    const response = await fetchWithAuth(`/api/admin/dashboard`, {
      method: "GET",
      credentials: "include",
    });
    return await handleResponse<AdminDashboardDTO>(response);
  } catch (error: unknown) {
    console.error("Error fetching admin dashboard:", error);
    throw error;
  }
}
