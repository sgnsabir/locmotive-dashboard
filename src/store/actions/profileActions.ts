// src/store/actions/profileActions.ts
import { Dispatch } from "redux";
import { API_BASE_URL, handleResponse } from "@/api/apiHelper";

// Define a type for profile update payload
export interface ProfileUpdate {
  username: string;
  email: string;
  avatarUrl: string;
  twoFactorEnabled: boolean;
  phoneNumber: string;
}

export const updateProfile =
  (profileData: ProfileUpdate) => async (dispatch: Dispatch) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // In production, use credentials to allow HTTP‑only cookies to be sent
        credentials: "include",
        body: JSON.stringify(profileData),
      });
      const updatedProfile = await handleResponse<ProfileUpdate>(response);
      dispatch({ type: "UPDATE_PROFILE_SUCCESS", payload: updatedProfile });
    } catch (err: unknown) {
      let message = "Failed to update profile";
      if (err instanceof Error) {
        message = err.message;
      }
      dispatch({ type: "UPDATE_PROFILE_FAILURE", payload: message });
    }
  };
