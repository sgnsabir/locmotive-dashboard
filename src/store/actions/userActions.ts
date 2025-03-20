// src/store/actions/userActions.ts
import { Dispatch } from "redux";
import { API_BASE_URL, handleResponse } from "@/api/apiHelper";
import { getAllUsers, deleteUser as apiDeleteUser } from "@/api/userManagement";
import type { UserResponse } from "@/types/auth";
import { UserData } from "@/types/user";

// Action to fetch all users from the backend
export const fetchUsers = () => async (dispatch: Dispatch) => {
  dispatch({ type: "FETCH_USERS_REQUEST" });
  try {
    const users: UserResponse[] = await getAllUsers();
    dispatch({
      type: "FETCH_USERS_SUCCESS",
      payload: { users, total: users.length },
    });
  } catch (error: unknown) {
    let message = "Failed to fetch users";
    if (error instanceof Error) {
      message = error.message;
    }
    dispatch({ type: "FETCH_USERS_FAILURE", payload: message });
  }
};

// Action to create a new user using the backend API
export const createUser =
  (userData: UserData) => async (dispatch: Dispatch) => {
    dispatch({ type: "CREATE_USER_REQUEST" });
    try {
      const token = localStorage.getItem("authToken") || "";
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });
      const newUser = await handleResponse<UserResponse>(response);
      dispatch({ type: "CREATE_USER_SUCCESS", payload: newUser });
    } catch (error: unknown) {
      let message = "Failed to create user";
      if (error instanceof Error) {
        message = error.message;
      }
      dispatch({ type: "CREATE_USER_FAILURE", payload: message });
    }
  };

// Action to delete a user using the backend API
export const deleteUser = (userId: number) => async (dispatch: Dispatch) => {
  dispatch({ type: "DELETE_USER_REQUEST" });
  try {
    await apiDeleteUser(userId);
    dispatch({ type: "DELETE_USER_SUCCESS", payload: userId });
  } catch (error: unknown) {
    let message = "Failed to delete user";
    if (error instanceof Error) {
      message = error.message;
    }
    dispatch({ type: "DELETE_USER_FAILURE", payload: message });
  }
};
